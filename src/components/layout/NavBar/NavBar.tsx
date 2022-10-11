import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../../../assets/hoaxify.png";
import { useDispatch, useSelector } from "react-redux";
import { onLogoutSuccess, RootState } from "../../../core/redux/store";
import { logout } from "../../../core/api/apiCalls";

export const NavBar = () => {
  const auth = useSelector((store: RootState) => store);
  const { t } = useTranslation();
  const dipatch = useDispatch();

  const onClickLogout = async (event: MouseEvent) => {
    event.preventDefault();
    try {
      await logout();
    } catch (error) {}
    dipatch(
      onLogoutSuccess({
        ...auth,
      })
    );
  };

  let content;

  if (!auth.isLoggedIn) {
    content = (
      <>
        <Link className="nav-link" to="/signup">
          {t("signUp")}
        </Link>
        <Link className="nav-link" to="/login">
          {t("login")}
        </Link>
      </>
    );
  } else {
    content = (
      <>
        <Link className="nav-link" to={`/user/${auth.id}`}>
          My Profile
        </Link>
        <a className="nav-link" href="/" onClick={onClickLogout}>
          Logout
        </a>
      </>
    );
  }

  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" title="Home">
          <img src={logo} alt="Hoaxify" width="60" />
          Hoaxify
        </Link>
        <ul className="navbar-nav">{content}</ul>
      </div>
    </nav>
  );
};
