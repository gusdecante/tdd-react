import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./core/locale/i18n";
import { AuthProvider } from "./core/context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    id: "",
  },
  reducers: {
    setTrue: (state) => {
      state.isLoggedIn = true;
    },
  },
});

const store = configureStore({
  reducer: authSlice.reducer,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

export type RootState = ReturnType<typeof store.getState>;

export const { setTrue } = authSlice.actions;

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
