import axios from "axios";
import { ChangeEvent, Component, FormEvent } from "react";

// if (error?.response.status === 400) {
//   this.setState({ errors: error.response.data.validationErrors });
// }

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

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {
      username: undefined,
      email: undefined,
      password: undefined,
    },
  } as SingUpFormRequestProps;

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
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
    let disabled = true;
    const { apiProgress, errors, password, passwordRepeat, signUpSuccess } =
      this.state;

    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {!signUpSuccess && (
          <form className="card mt-5" data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">SignUp</h1>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  {" "}
                  Username
                </label>
                <input
                  id="username"
                  onChange={this.onChange}
                  className="form-control"
                />
                <span>{errors.username}</span>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  {" "}
                  E-mail
                </label>
                <input
                  id="email"
                  onChange={this.onChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={this.onChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordRepeat" className="form-label">
                  Password Repeat
                </label>
                <input
                  type="password"
                  id="passwordRepeat"
                  onChange={this.onChange}
                  className="form-control"
                />
              </div>
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
                  Sign Up
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
      </div>
    );
  }
}

export default SignUp;
