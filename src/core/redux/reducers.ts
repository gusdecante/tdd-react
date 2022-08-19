import { PayloadAction } from "@reduxjs/toolkit";
import { AuthProps } from "./store";

export const reducers = {
  onLoginSuccess: (state: AuthProps, action: PayloadAction<AuthProps>) => {
    state.id = action.payload.id;
    state.isLoggedIn = action.payload.isLoggedIn;
  },
};
