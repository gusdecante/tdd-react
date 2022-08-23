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

const createStore = () => {
  let initialState = {
    isLoggedIn: false,
    id: undefined,
  };

  const storedState = localStorage.getItem("auth");

  if (storedState !== null) {
    try {
      initialState = JSON.parse(storedState);
    } catch (err) {}
  }

  const authSlice = createSlice<AuthProps, SliceCaseReducers<AuthProps>>({
    name: "auth",
    initialState,
    reducers,
  });

  const store = configureStore({
    reducer: authSlice.reducer,
  });

  // console.log(initialState);

  store.subscribe(() => {
    localStorage.setItem("auth", JSON.stringify(store.getState()));
  });

  return {
    store,
    onLoginSuccess: authSlice.actions.onLoginSuccess,
  };
};

export const { store, onLoginSuccess } = createStore();

export type RootState = ReturnType<typeof store.getState>;
