import { ChangeEvent, Component } from "react";

type EnabledProps = {
  password?: string;
  passwordRepeat?: string;
};

class SignUp extends Component {
  state = {
    password: undefined,
    passwordRepeat: undefined,
  } as EnabledProps;

  onChangePassword = (event: ChangeEvent<HTMLInputElement> | undefined) => {
    const currentValue = event?.target.value;
    this.setState({
      password: currentValue,
    });
  };

  onChangePasswordRepeat = (
    event: ChangeEvent<HTMLInputElement> | undefined
  ) => {
    const currentValue = event?.target.value;
    this.setState({
      passwordRepeat: currentValue,
    });
  };

  render() {
    let enabled = true;
    const { password, passwordRepeat } = this.state;

    if (password && passwordRepeat) {
      enabled = password !== passwordRepeat;
    }
    return (
      <div>
        <h1>SignUp</h1>
        <label htmlFor="username"> Username</label>
        <input id="username" />
        <label htmlFor="email"> E-mail</label>
        <input id="email" />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => this.onChangePassword(e)}
        />
        <label htmlFor="passwordRepeat">Password Repeat</label>
        <input
          type="password"
          id="passwordRepeat"
          onChange={(e) => this.onChangePasswordRepeat(e)}
        />
        <button disabled={enabled} type="submit">
          Sign Up
        </button>
      </div>
    );
  }
}

export default SignUp;
