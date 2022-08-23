import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../../../assets/hoaxify.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/redux/store";

const Wrapper: React.FC<RootState> = ({ isLoggedIn, id }) => {
  const { t } = useTranslation();

  let content;

  if (!isLoggedIn) {
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
      <Link
        style={{ display: isLoggedIn ? "initial" : "none" }}
        className="nav-link"
        to={`/user/${id}`}
      >
        My Profile
      </Link>
    );
  }
  return content;
};

export const NavBar = () => {
  const auth = useSelector((store: RootState) => store);

  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" title="Home">
          <img src={logo} alt="Hoaxify" width="60" />
          Hoaxify
        </Link>
        <ul className="navbar-nav">
          <Wrapper {...auth} />
        </ul>
      </div>
    </nav>
  );
};
