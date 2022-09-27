import { PayloadAction } from "@reduxjs/toolkit";
import { AuthProps } from "./store";

export const reducers = {
  onLoginSuccess: (state: AuthProps, action: PayloadAction<AuthProps>) => {
    state.id = action.payload.id;
    state.isLoggedIn = action.payload.isLoggedIn;
    state.username = action.payload.username;
    state.image = action.payload.image;
    state.isLoggedIn = true;
    state.header = action.payload.header;
  },
};
