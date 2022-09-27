import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "../../core/test/setup";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest, DefaultBodyType } from "msw";
import en from "../../core/locale/en.json";
import pt from "../../core/locale/pt.json";
import { LoginPage } from "./index";
import { storage } from "../../core/redux/storage";

let requestBody: DefaultBodyType;
let count = 0;
let acceptLanguageHeader: string | null;

const server = setupServer(
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    requestBody = req.body;
    count += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(ctx.status(401), ctx.json({ message: "Incorrect credentials" }));
  })
);

beforeEach(() => {
  count = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const loginSuccess = rest.post("/api/1.0/auth", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      id: 5,
      username: "user5",
      image: null,
      token: "abcdefgh",
    })
  );
});
const setupWithRouter = () => {
  render(<LoginPage />);
};

describe("Login Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      setupWithRouter();
      const header = screen.getByRole("heading", {
        name: "Login",
      });
      expect(header).toBeInTheDocument();
    });
    it("has email input", () => {
      setupWithRouter();

      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      setupWithRouter();

      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      setupWithRouter();

      const input = screen.getByLabelText("Password") as HTMLInputElement;
      expect(input.type).toBe("password");
    });
    it("disables the button initially", () => {
      setupWithRouter();

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
    const setup = (email = "user100@mail.com") => {
      setupWithRouter();
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, email);
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
    it("stores id, username and image in storage", async () => {
      server.use(loginSuccess);

      setup("user5@mail.com");
      userEvent.click(button);
      const spinner = screen.queryByRole("status");
      await waitForElementToBeRemoved(spinner);
      const storadeState = storage.getItem("auth");
      const objectFields = Object.keys(storadeState);
      expect(objectFields.includes("id")).toBeTruthy();
      expect(objectFields.includes("username")).toBeTruthy();
      expect(objectFields.includes("image")).toBeTruthy();
    });
    it("stores authorization header value in storage", async () => {
      server.use(loginSuccess);

      setup("user5@mail.com");
      userEvent.click(button);
      const spinner = screen.queryByRole("status");
      await waitForElementToBeRemoved(spinner);
      const storadeState = storage.getItem("auth");
      expect(storadeState.header).toBe("Bearer abcdefgh");
    });
  });
  describe("Intenationalization", () => {
    let portugueseToggle: Element;
    let englishToggle: Element;
    const setup = () => {
      render(<LoginPage />);

      portugueseToggle = screen.getByTitle("Portuguese");
      englishToggle = screen.getByTitle("English");
    };

    it("initially displays all text in English", () => {
      setup();

      expect(
        screen.getByRole("heading", { name: en.login })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.login })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
    });
    it("displays all text in Portuguese after changing the language", () => {
      setup();

      userEvent.click(portugueseToggle);

      expect(
        screen.getByRole("heading", { name: pt.login })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: pt.login })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(pt.email)).toBeInTheDocument();
      expect(screen.getByLabelText(pt.password)).toBeInTheDocument();
    });
    it("sets accept language header to en for outgoing request", async () => {
      setup();
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", {
        name: "Login",
      }) as HTMLButtonElement;
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe("en");
    });
    it("sets accept language header to pt for outgoing request", async () => {
      setup();
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", {
        name: "Login",
      }) as HTMLButtonElement;
      userEvent.click(portugueseToggle);
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe("pt");
    });
  });
});
