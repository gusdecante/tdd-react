import axios from "axios";
import { ChangeEvent, Component, FormEvent } from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import Input from "../components/Input";

type ValidationErrorsProps = {
  username?: string;
  email?: string;
  password?: string;
};

type SingUpFormRequestProps = {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
  apiProgress: boolean;
  signUpSuccess: boolean;
  errors: ValidationErrorsProps;
};

class SignUpPage extends Component<WithTranslation> {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {
      username: "",
      email: "",
      password: "",
    },
  } as SingUpFormRequestProps;

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    const errorsCopy = { ...this.state.errors };
    delete errorsCopy[id as "email" | "password" | "username"];
    this.setState({
      [id]: value,
      errors: errorsCopy,
    });
  };

  submit = async (event: FormEvent) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });
    try {
      await axios.post("/api/1.0/users", body);
      this.setState({ signUpSuccess: true });
    } catch (error: any) {
      if (error?.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
      }
      this.setState({ apiProgress: false });
    }
  };

  render() {
    const { t } = this.props;
    let disabled = true;
    const { apiProgress, errors, password, passwordRepeat, signUpSuccess } =
      this.state;

    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }

    let passwordMismatch =
      password !== passwordRepeat ? "Password mismatch" : "";
    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {!signUpSuccess && (
          <form className="card mt-5" data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">{t("signUp")}</h1>
            </div>
            <div className="card-body">
              <Input
                id="username"
                label={t("username")}
                onChange={this.onChange}
                help={errors.username}
              />
              <Input
                id="email"
                label={t("email")}
                onChange={this.onChange}
                help={errors.email}
              />
              <Input
                id="password"
                label={t("password")}
                onChange={this.onChange}
                help={errors.password}
                type="password"
              />
              <Input
                id="passwordRepeat"
                label={t("passwordRepeat")}
                onChange={this.onChange}
                help={passwordMismatch}
                type="password"
              />
              <div className="text-center">
                <button
                  className="btn btn-primary"
                  disabled={disabled || apiProgress}
                  onClick={this.submit}
                >
                  {apiProgress && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  )}
                  {t("signUp")}
                </button>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <div className="alert alert-success mt-3">
            Please check your e-mail to activate your account
          </div>
        )}
        <img
          src="https://countryflagsapi.com/svg/br"
          alt="Brazil flag"
          title="Portuguese"
          height="32px"
          onClick={() => this.props.i18n.changeLanguage("pt")}
        />
        <img
          src="https://countryflagsapi.com/svg/gb"
          alt="The United States Of America flag"
          height="32px"
          title="English"
          onClick={() => this.props.i18n.changeLanguage("en")}
        />
      </div>
    );
  }
}

const SignUpPageWithTranslation = withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
