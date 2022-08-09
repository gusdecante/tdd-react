import React, { FormEvent, useState, useEffect, useContext } from "react";
import { Alert, Input, ButtonWithProgress } from "../../components";
import { login } from "../../core/api/apiCalls";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../core/context/AuthContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [apiProgress, setApiProgress] = useState(false);
  const [failMessage, setFailMessage] = useState();
  const { onLoginSuccess } = useContext(AuthContext);
  let navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    setFailMessage(undefined);
  }, [email, password]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setApiProgress(true);
    try {
      if (email && password) {
        const response = await login({ email, password });
        navigate("/", { replace: true });
        onLoginSuccess({
          isLoggedIn: true,
          id: response.data.id,
        });
      }
    } catch (error: any) {
      setFailMessage(error.response.data.message);
    }
    setApiProgress(false);
  };

  let disabled = !(email && password);

  return (
    <div
      className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
      data-testid="login-page"
    >
      <form className="card">
        <div className="card-header">
          <h1 className="text-center">{t("login")}</h1>
        </div>
        <div className="card-body">
          <Input
            id="email"
            label={t("email")}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="password"
            label={t("password")}
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          {failMessage && <Alert type="danger">{failMessage}</Alert>}
          <div className="text-center">
            <ButtonWithProgress
              disabled={disabled}
              apiProgress={apiProgress}
              onClick={submit}
            >
              {t("login")}
            </ButtonWithProgress>
          </div>
        </div>
      </form>
    </div>
  );
};
