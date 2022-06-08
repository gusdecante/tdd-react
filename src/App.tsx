import { MouseEvent, useState } from "react";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import LanguageSelector from "./components/LanguageSelector";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const [path, setPath] = useState<string>(window.location.pathname);

  const onClickLink = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const el = event.target as HTMLAnchorElement;
    const path = el.getAttribute("href") as string;
    window.history.pushState({}, "", path);
    setPath(path);
  };

  return (
    <div className="container">
      <div>
        <a href="/" title="Home" onClick={onClickLink}>
          Hoaxify
        </a>
        <a href="/signup" onClick={onClickLink}>
          {t("signUp")}
        </a>
        <a href="/login" onClick={onClickLink}>
          Login
        </a>
      </div>
      {path === "/" && <HomePage />}
      {path === "/signup" && <SignUpPage />}
      {path === "/login" && <LoginPage />}
      {path.startsWith("/user/") && <UserPage />}
      <LanguageSelector />
    </div>
  );
}

export default App;
