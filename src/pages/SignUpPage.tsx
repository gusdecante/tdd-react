import axios from "axios";
import { ChangeEvent, Component, FormEvent } from "react";

type SingUpFormRequestProps = {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
};

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
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
    axios.post("http://localhost:8080/api/1.0/users", body);
  };

  render() {
    let enabled = true;
    const { password, passwordRepeat } = this.state;

    if (password && passwordRepeat) {
      enabled = password !== passwordRepeat;
    }
    return (
      <div>
        <form>
          <h1>SignUp</h1>
          <label htmlFor="username"> Username</label>
          <input id="username" onChange={this.onChange} />
          <label htmlFor="email"> E-mail</label>
          <input id="email" onChange={this.onChange} />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={this.onChange} />
          <label htmlFor="passwordRepeat">Password Repeat</label>
          <input type="password" id="passwordRepeat" onChange={this.onChange} />
          <button disabled={enabled} onClick={this.submit}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}

export default SignUp;
