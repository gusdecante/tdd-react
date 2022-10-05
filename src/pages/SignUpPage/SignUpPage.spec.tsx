import SignUpPage from "./SignUpPage";
import {
  render,
  screen,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
} from "../../core/test/setup";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { DefaultBodyType, rest } from "msw";
import en from "../../core/locale/en.json";
import pt from "../../core/locale/pt.json";

let requestBody: DefaultBodyType;
let counter = 0;
let acceptLanguageHeader: string | null;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    counter += 1;
    req.json().then((data) => {
      requestBody = data;
    });
    acceptLanguageHeader = req.headers.get("Accept-language");
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const user = userEvent.setup();

describe("SignUp Page", () => {
  describe("Layout", () => {
    afterEach(cleanup);
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.getByRole("heading", {
        name: "Sign Up",
      });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Password") as HTMLInputElement;
      expect(input.type).toBe("password");
    });
    it("has password repeat input", () => {
      render(<SignUpPage />);

      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
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
    let button: HTMLButtonElement,
      usernameInput: Element,
      emailInput: Element,
      passwordInput: Element,
      passwordRepeatInput: Element;
    const setup = async () => {
      render(<SignUpPage />);
      usernameInput = screen.getByLabelText("Username");
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
      await user.type(usernameInput, "user1");
      await user.type(emailInput, "johndoe@me.com");
      await user.type(passwordInput, "P4ssword");
      await user.type(passwordRepeatInput, "P4ssword");

      button = screen.queryByRole("button", {
        name: "Sign Up",
      }) as HTMLButtonElement;
    };

    it("enables the buttons when password and password repeat fields have same value", async () => {
      await setup();
      expect(button.disabled).toBe(false);
    });
    it("sends username, email and password to backend after clicking the button", async () => {
      server.listen();
      await setup();
      await user.click(button);

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
      await setup();

      await user.click(button);
      await user.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });
    it("display spinner while there is an ongoing api call", async () => {
      await setup();

      await user.click(button);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
    it("display spinner after clicking submit", async () => {
      await setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      await user.click(button);
      expect(screen.getByRole("status")).toBeInTheDocument();
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
    });
    it("displays account activation notification after successful sign up request", async () => {
      server.listen();
      await setup();
      const message = "Please check your e-mail to activate your account";
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      await user.click(button);
    });
    it("hides sign up form after successful sign up request", async () => {
      await setup();

      const form = screen.getByTestId("form-sign-up");
      await user.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });
    const generateValidationError = (field: string, message: string) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Passsword cannot be null"}
    `("display $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      await setup();
      await user.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });
    it("hides spinner and enables button after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();
      await user.click(button);
      await screen.findByText("Username cannot be null");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });
    it("displays mismatch for password repeat", async () => {
      setup();
      await user.type(passwordInput, "P4ssword");
      await user.type(passwordRepeatInput, "AnotherP4ssword");
      const validationError = screen.queryByText("Password mismatch");
      expect(validationError).toBeInTheDocument();
    });
    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears validation error after $field field is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        setup();
        await user.click(button);
        await user.type(screen.getByLabelText(label), "updated");
        expect(screen.queryByLabelText(message)).not.toBeInTheDocument();
      }
    );
  });
  describe("Internationalization", () => {
    let portugueseToggle: Element;
    let englishToggle: Element;
    let usernameInput: Element;
    let emailInput: Element;
    let passwordInput: Element;
    let passwordRepeat: Element;
    const setup = () => {
      render(<SignUpPage />);

      portugueseToggle = screen.getByTitle("Portuguese");
      englishToggle = screen.getByTitle("English");
      usernameInput = screen.getByLabelText("Username");
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeat = screen.getByLabelText("Password Repeat");
    };

    it("initially displays all text in English", () => {
      setup();

      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });
    it("displays all text in Portuguese after changing the language", async () => {
      setup();

      await user.click(portugueseToggle);

      expect(
        screen.getByRole("heading", { name: pt.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: pt.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(pt.username)).toBeInTheDocument();
      expect(screen.getByLabelText(pt.email)).toBeInTheDocument();
      expect(screen.getByLabelText(pt.password)).toBeInTheDocument();
      expect(screen.getByLabelText(pt.passwordRepeat)).toBeInTheDocument();
    });
    it("displays all text in English after changing back from Portuguese", async () => {
      setup();

      await user.click(portugueseToggle);
      await user.click(englishToggle);

      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });
    it("displays password mismatch validation in Portuguese", async () => {
      setup();

      await user.click(portugueseToggle);

      await user.type(passwordInput, "P4ss");
      const validationMessageInPortuguese = screen.queryByText(
        pt.passwordMismatchValidation
      );
      expect(validationMessageInPortuguese).toBeInTheDocument();
    });
    it("sends accept language header as en for outgoing request", async () => {
      setup();

      await user.type(usernameInput, "johndoe");
      await user.type(emailInput, "john.doe@me.com");
      await user.type(passwordInput, "P4ssword");
      await user.type(passwordRepeat, "P4ssword");

      await user.click(screen.getByRole("button", { name: en.signUp }));
      await waitForElementToBeRemoved(screen.queryByTestId("form-sign-up"));
      expect(acceptLanguageHeader).toBe("en");
    });
    it("sends accept language header as pt for outgoing request after selecting that language", async () => {
      setup();

      await user.type(usernameInput, "johndoe");
      await user.type(emailInput, "john.doe@me.com");
      await user.type(passwordInput, "P4ssword");
      await user.type(passwordRepeat, "P4ssword");

      await user.click(portugueseToggle);
      const form = screen.queryByTestId("form-sign-up");
      await user.click(screen.getByRole("button", { name: pt.signUp }));
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("pt");
    });
  });
});
