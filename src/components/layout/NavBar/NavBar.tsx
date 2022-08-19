import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../../../assets/hoaxify.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/redux/store";

export const NavBar = () => {
  const { t } = useTranslation();
  const auth = useSelector((store: RootState) => store);

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
            <Link
              data-testid={auth.isLoggedIn ? null : "not-logged"}
              className="nav-link"
              to={`/user/${auth.id}`}
            >
              My Profile
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};
