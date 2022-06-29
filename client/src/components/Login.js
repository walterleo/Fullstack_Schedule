import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [login, setLogin] = useState({ email: "", password: "" });
  const onChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };
  let navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/user/login", login);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response.data);
      navigate("/user/verifyerror");
    }
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
