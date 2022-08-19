import {
  configureStore,
  createSlice,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { reducers } from "./reducers";

export type AuthProps = {
  isLoggedIn: boolean;
  id?: number;
};

const authSlice = createSlice<AuthProps, SliceCaseReducers<AuthProps>>({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    id: undefined,
  },
  reducers,
});

export const store = configureStore({
  reducer: authSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export const { onLoginSuccess } = authSlice.actions;
