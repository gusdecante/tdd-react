import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignUpPage from "./SignUpPage";

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
    it("enables the buttons when password and password repeat fields have same value", () => {
      render(<SignUpPage />);

      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");

      const button = screen.queryByRole("button", {
        name: "Sign Up",
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });
  });
});
