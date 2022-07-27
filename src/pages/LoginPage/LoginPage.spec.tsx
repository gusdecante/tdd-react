import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { LoginPage } from "./index";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest, DefaultBodyType } from "msw";

let requestBody: DefaultBodyType;
let count = 0;

const server = setupServer(
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    count += 1;
    requestBody = req.body;
    return res(ctx.status(404), ctx.json({ message: "Incorrect credentials" }));
  })
);

beforeEach(() => {
  count = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

describe("Login Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<LoginPage />);
      const header = screen.getByRole("heading", {
        name: "Login",
      });
      expect(header).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<LoginPage />);

      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(<LoginPage />);

      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(<LoginPage />);

      const input = screen.getByLabelText("Password") as HTMLInputElement;
      expect(input.type).toBe("password");
    });
    it("disables the button initially", () => {
      render(<LoginPage />);

      const button = screen.queryByRole("button", {
        name: "Login",
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });
  describe("Interactions", () => {
    let button: HTMLButtonElement;
    let emailInput: HTMLElement;
    let passwordInput: HTMLElement;
    const setup = () => {
      render(<LoginPage />);
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");

      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");

      button = screen.queryByRole("button", {
        name: "Login",
      }) as HTMLButtonElement;
    };
    it("enables the button when email and password inputs are filled", () => {
      setup();
      expect(button.disabled).toBe(false);
    });

    it("displays spinner during api call", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
    });
    it("sends email and password to backend after clicking the button", async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(requestBody).toEqual({
        email: "user100@mail.com",
        password: "P4ssword",
      });
    });
    it("disables the button when there is an api call", async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(count).toEqual(1);
    });
    it("displays authenticate fail message", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      expect(errorMessage).toBeInTheDocument();
    });
    it("clears authentication fail message when email field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(emailInput, "new@mail.com");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("clears authentication fail message when password field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(passwordInput, "newP4ss");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
