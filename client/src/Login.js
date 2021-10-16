import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useCurrentUser, useUpdateUser } from "./CurrentUserContext";

const initialState = { username: "", password: "" };

const Login = () => {
  const [state, setState] = useState(initialState);

  const user = useCurrentUser();
  const { updateUser, loginFunc } = useUpdateUser();
  let history = useHistory();

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  //for testing:
  React.useEffect(() => {
    console.log("login page:", user);
  }, []);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    loginFunc(state);
    //after signing in, should redirect to spots list page

    //history.push("/spots");
    history.push("/profile");

    window.location.reload();
  };

  return (
    <div>
      This is log in page
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
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <br />
        <button>Log In</button>
      </form>
      <div>
        username: {state.username}
        <br />
        psw: {state.password}
      </div>
    </div>
  );
};
export default Login;
