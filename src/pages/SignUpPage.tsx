import axios from "axios";
import { ChangeEvent, Component, FormEvent } from "react";

type SingUpFormRequestProps = {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
  apiProgress: boolean;
};

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
  } as SingUpFormRequestProps;

  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
    });
  };

  submit = (event: FormEvent) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });
    axios.post("/api/1.0/users", body);
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat, apiProgress } = this.state;

    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        <form className="card mt-5">
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
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
