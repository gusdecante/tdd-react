import SignUpPage from "./SignUpPage";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { DefaultBodyType, rest } from "msw";
import "../core/locale/i18n";
import en from "../core/locale/en.json";
import pt from "../core/locale/pt.json";

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
    let requestBody: DefaultBodyType;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        counter += 1;
        requestBody = req.body;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });

    beforeAll(() => server.listen());

    afterAll(() => server.close());

    let button: HTMLButtonElement,
      usernameInput: Element,
      emailInput: Element,
      passwordInput: Element,
      passwordRepeatInput: Element;
    const setup = () => {
      render(<SignUpPage />);
      usernameInput = screen.getByLabelText("Username");
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
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
      setup();

      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });
    it("display spinner while there is an ongoing api call", async () => {
      setup();

      userEvent.click(button);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
    it("display spinner after clicking submit", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);
      expect(screen.getByRole("status")).toBeInTheDocument();
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
    });
    it("displays account activation notification after successful sign up request", async () => {
      server.listen();
      setup();
      const message = "Please check your e-mail to activate your account";
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);
    });
    it("hides sign up form after successful sign up request", async () => {
      server.listen();
      setup();

      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
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
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });
    it("hides spinner and enables button after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      setup();
      userEvent.click(button);
      await screen.findByText("Username cannot be null");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });
    it("displays mismatch for password repeat", () => {
      setup();
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "AnotherP4ssword");
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
        userEvent.click(button);
        userEvent.type(screen.getByLabelText(label), "updated");
        expect(screen.queryByLabelText(message)).not.toBeInTheDocument();
      }
    );
  });
  describe("Internationalization", () => {
    it("initially displays all text in English", () => {
      render(<SignUpPage />);
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
    it("displays all text in Portuguese after changing the language", () => {
      render(<SignUpPage />);

      const portugueseToggle = screen.getByTitle("Portuguese");
      userEvent.click(portugueseToggle);

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
    it("displays all text in English after changing back from Portuguese", () => {
      render(<SignUpPage />);

      const portugueseToggle = screen.getByTitle("Portuguese");
      userEvent.click(portugueseToggle);
      const englishToggle = screen.getByTitle("English");
      userEvent.click(englishToggle);

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
  });
});
