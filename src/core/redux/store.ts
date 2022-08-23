import {
  configureStore,
  createSlice,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { reducers } from "./reducers";
import { storage } from "./storage";

export type AuthProps = {
  isLoggedIn: boolean;
  id?: number;
};

const createStore = () => {
  let initialState = storage.getItem("auth") || {
    isLoggedIn: false,
    id: undefined,
  };

  const authSlice = createSlice<AuthProps, SliceCaseReducers<AuthProps>>({
    name: "auth",
    initialState,
    reducers,
  });

  const store = configureStore({
    reducer: authSlice.reducer,
  });

  store.subscribe(() => {
    storage.setItem("auth", store.getState());
  });

  return {
    store,
    onLoginSuccess: authSlice.actions.onLoginSuccess,
  };
};

export const { store, onLoginSuccess } = createStore();

export type RootState = ReturnType<typeof store.getState>;
