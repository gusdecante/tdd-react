import { createContext, Dispatch, SetStateAction, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import { HomePage, LoginPage, UserPage, AccountActivationPage } from "./pages";
import { NavBar, LanguageSelector } from "./components";

type AuthProps = {
  isLoggedIn: boolean;
  id?: number;
};

type AuthContextProps = {
  isLoggedIn: boolean;
  id?: number;
  onLoginSuccess: Dispatch<SetStateAction<AuthProps>>;
};

export const AuthContext = createContext({} as AuthContextProps);

function App() {
  const [auth, setAuth] = useState<AuthProps>({
    isLoggedIn: false,
    id: undefined,
  });
  return (
    <AuthContext.Provider value={{ ...auth, onLoginSuccess: setAuth }}>
      <Router>
        <NavBar />
        <div className="container pt-3">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route
              path="/activate/:token"
              element={<AccountActivationPage />}
            />
          </Routes>
          <LanguageSelector />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
