import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import { HomePage, LoginPage, UserPage, AccountActivationPage } from "./pages";
import { NavBar, LanguageSelector } from "./components";

function App() {
  return (
    <>
      <NavBar />
      <div className="container pt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/activate/:token" element={<AccountActivationPage />} />
        </Routes>
        <LanguageSelector />
      </div>
    </>
  );
}

export default App;
