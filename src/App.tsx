import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import { HomePage, LoginPage, UserPage, AccountActivationPage } from "./pages";
import { LanguageSelector } from "./components";
import { useTranslation } from "react-i18next";
import logo from "./assets/hoaxify.png";

function App() {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });
  const { t } = useTranslation();

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/" title="Home">
            <img src={logo} alt="Hoaxify" width="60" />
            Hoaxify
          </Link>
          <ul className="navbar-nav">
            {!auth.isLoggedIn ? (
              <>
                <Link className="nav-link" to="/signup">
                  {t("signUp")}
                </Link>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </>
            ) : (
              <Link className="nav-link" to={`/user/${auth.id}`}>
                My Profile
              </Link>
            )}
          </ul>
        </div>
      </nav>
      <div className="container pt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={setAuth} />}
          />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/activate/:token" element={<AccountActivationPage />} />
        </Routes>
        <LanguageSelector />
      </div>
    </Router>
  );
}

export default App;
