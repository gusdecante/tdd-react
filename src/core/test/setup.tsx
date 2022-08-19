import { ReactNode, FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { LanguageSelector } from "../../components";
import { store } from "../redux/store";

const RootWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Router>
      <Provider store={store}>
        {children}
        <LanguageSelector />
      </Provider>
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
