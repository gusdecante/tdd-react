import { FormEvent, useState, useEffect } from "react";
import { Alert, Input, Spinner } from "../../components";
import { login } from "../../core/api/apiCalls";

export const LoginPage = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [apiProgress, setApiProgress] = useState(false);
  const [failMessage, setFailMessage] = useState();

  useEffect(() => {
    setFailMessage(undefined);
  }, [email, password]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setApiProgress(true);
    try {
      if (email && password) await login({ email, password });
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
          <h1 className="text-center">Login</h1>
        </div>
        <div className="card-body">
          <Input
            id="email"
            label="E-mail"
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          {failMessage && <Alert type="danger">{failMessage}</Alert>}
          <div className="text-center">
            <button
              className="btn btn-primary"
              disabled={disabled || apiProgress}
              onClick={submit}
            >
              {apiProgress && <Spinner />}
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
