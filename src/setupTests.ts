// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import i18n from "./core/locale/i18n";
import { storage } from "./core/redux/storage";

afterEach(() => {
  act(() => {
    i18n.changeLanguage("en");
  });
  storage.clear();
  cleanup();
});
