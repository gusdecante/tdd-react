// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import i18n from "./core/locale/i18n";

afterEach(() => {
  act(() => {
    i18n.changeLanguage("en");
  });
});
