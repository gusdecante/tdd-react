import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../../../assets/hoaxify.png";
import { AuthProps } from "../../../pages";

interface INavBar {
  auth: AuthProps;
}

export const NavBar: React.FC<INavBar> = ({ auth }) => {
  const { t } = useTranslation();

  return (
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
                {t("login")}
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
  );
};
