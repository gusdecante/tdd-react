import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import { HomePage, LoginPage, UserPage, AccountActivationPage } from "./pages";
import { NavBar } from "./components";
import { LanguageSelector } from "./components";

function App() {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });

  return (
    <Router>
      <NavBar auth={auth} />
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
