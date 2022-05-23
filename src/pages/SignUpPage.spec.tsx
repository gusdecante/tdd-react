import SignUpPage from "./SignUpPage";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("SignUp Page", () => {
  describe("Layout", () => {
    afterEach(cleanup);
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "SignUp" });
      expect(header).toBeTruthy();
    });
    it("has username input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Username");
      expect(input).toBeTruthy();
    });
    it("has email input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("E-mail");
      expect(input).toBeTruthy();
    });
    it("has password input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Password");
      expect(input).toBeTruthy();
    });
    it("has password type for password input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Password") as HTMLInputElement;
      expect(input.type).toBe("password");
    });
    it("has password repeat input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeTruthy();
    });
    it("has password type for password repeat input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText(
        "Password Repeat"
      ) as HTMLInputElement;
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(<SignUpPage />);

      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeTruthy();
    });
    it("disables the button initially", () => {
      render(<SignUpPage />);

      const button = screen.queryByRole("button", {
        name: "Sign Up",
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });
  describe("Interactions", () => {
    let button: HTMLButtonElement;

    const setup = () => {
      render(<SignUpPage />);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(usernameInput, "user1");
      userEvent.type(emailInput, "johndoe@me.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");

      button = screen.queryByRole("button", {
        name: "Sign Up",
      }) as HTMLButtonElement;
    };

    it("enables the buttons when password and password repeat fields have same value", () => {
      setup();
      expect(button.disabled).toBe(false);
    });
    it("sends username, email and password to backend after clicking the button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );

      expect(requestBody).toEqual({
        username: "user1",
        email: "johndoe@me.com",
        password: "P4ssword",
      });
    });
    it("disables button when there is an ongoing api call", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter += 1;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();

      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });
    it("display spinner while the api request in progress", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();

      userEvent.click(button);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeTruthy();
    });
    it("display spinner after clicking submit", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      expect(screen.queryByRole("status")).toBeFalsy();
      userEvent.click(button);
      expect(screen.getByRole("status")).toBeTruthy();
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
    });
    it("displays account activation notification after successful sign up request", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      const message = "Please check your e-mail to activate your account";
      expect(screen.queryByText(message)).toBeFalsy();
      userEvent.click(button);
    });
  });
});
