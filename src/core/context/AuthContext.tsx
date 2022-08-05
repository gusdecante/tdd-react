import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type AuthProps = {
  isLoggedIn: boolean;
  id?: number;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextProps = {
  isLoggedIn: boolean;
  id?: number;
  onLoginSuccess: Dispatch<SetStateAction<AuthProps>>;
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthProps>({
    isLoggedIn: false,
    id: undefined,
  });
  return (
    <AuthContext.Provider value={{ ...auth, onLoginSuccess: setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
