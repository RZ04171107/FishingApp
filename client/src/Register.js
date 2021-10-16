import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useCurrentUser, useUpdateUser } from "./CurrentUserContext";

const initialState = { username: "", email: "", password: "" };
const Register = () => {
  const [state, setState] = useState(initialState);
  let history = useHistory();

  const user = useCurrentUser();
  const { registerFunc } = useUpdateUser();

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    registerFunc(state);

    //after signing up, should redirect to spots list page
    history.push("/profile");
    window.location.reload();
  };

  return (
    <div>
      This is register page
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          name="username"
          type="text"
          value={state.username}
          onChange={handleChange}
          required
        />
        <br />
        <label>E-mail</label>
        <input
          name="email"
          type="email"
          value={state.email}
          onChange={handleChange}
          required
        />
        <br />
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <br />
        <button>Register</button>
      </form>
      <div>
        username: {state.username}
        <br />
        email: {state.email}
      </div>
    </div>
  );
};
export default Register;
