import { ChangeEvent, Component, FormEvent } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { signUp } from "../../core/api/apiCalls";
import { Alert, Input, Spinner } from "../../components/";
import withHover from "../../components/layout";

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
      await signUp(body);
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
      password !== passwordRepeat ? t("passwordMismatchValidation") : "";
    return (
      <div
        className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
        data-testid="signup-page"
      >
        {!signUpSuccess && (
          <form className="card" data-testid="form-sign-up">
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
                  {apiProgress && <Spinner />}
                  {t("signUp")}
                </button>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <Alert>Please check your e-mail to activate your account</Alert>
        )}
      </div>
    );
  }
}

const SignUpPageWithTranslation = withTranslation()(withHover(SignUpPage));

export default SignUpPageWithTranslation;
