import React from "react";

const SignUp: React.FC = () => {
  return (
    <div>
      <h1>SignUp</h1>
      <label htmlFor="username"> Username</label>
      <input id="username" />
      <label htmlFor="email"> E-mail</label>
      <input id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" />
      <label htmlFor="passwordRepeat">Password Repeat</label>
      <input type="password" id="passwordRepeat" />
      <button disabled type="submit">
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;
