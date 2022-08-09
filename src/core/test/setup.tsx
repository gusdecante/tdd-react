import { ReactNode, FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { LanguageSelector } from "../../components";

const RootWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Router>
      <AuthProvider>
        {children}
        <LanguageSelector />
      </AuthProvider>
    </Router>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: RootWrapper, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
