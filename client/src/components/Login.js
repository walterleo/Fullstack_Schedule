import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [login, setLogin] = useState({ email: "", password: "" });
  const onChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(login);
    //   console.log(res.data);
    // } catch (error) {
    //   console.log(error.response.data);
    // }
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="container">
        <h1>Login</h1>

        <hr />

        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          id="email"
          onChange={onChange}
          required
        />

        <label htmlFor="psw">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          id="psw"
          onChange={onChange}
          required
        />

        <hr />

        <button type="submit" className="registerbtn">
          Login
        </button>
      </div>

      <div className="container signin">
        <p>
          Don't have an account? <Link to="/register">Register here</Link>.
        </p>
      </div>
    </form>
  );
}

export default Login;
