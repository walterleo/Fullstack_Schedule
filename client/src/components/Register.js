import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [register, setRegister] = useState({
    firstname: "",
    email: "",
    password: "",
    passwordrepeat: "",
    phone: "",
    address: "",
  });

  const onChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };
  let navigate = useNavigate();
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        "/api/users/register",
        register
      );
      navigate("/login");
    } catch (error) {
      navigate("/user/verifyerror/");
    }
  };

  return (
    <form onSubmit={onSubmit}>

      <div className="container">

        <h1>Register</h1>
        <p>Please fill in this form to create an account.</p>
        <hr />

        <label htmlFor="firstName">
          <b>FirstName</b>
        </label>
        <input
          type="text"
          placeholder="Enter your first name"
          name="firstname"
          onChange={onChange}
        />

        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          onChange={onChange}
        />

        <label htmlFor="password">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          onChange={onChange}
        />

        <label htmlFor="password-repeat">
          <b>Confirm Password</b>
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          name="passwordrepeat"
          onChange={onChange}
        />

        <label htmlFor="phone">
          <b>Phone</b>
        </label>
        <input
          type="tel"
          placeholder="Enter your contact number"
          name="phone"
          onChange={onChange}
        />

        <label htmlFor="address">
          <b>Address</b>
        </label>
        <textarea
          placeholder="Enter your address"
          name="address"
          rows="4"
          cols="50"
          onChange={onChange}
        />
        <hr />
        <p>By creating an account you agree to our terms</p>

        <button type="submit" className="registerbtn">
          Register
        </button>
      </div>

      <div className="container signin">
        <p>
          Already have an account? <Link to="/login">Sign in</Link>.
        </p>
      </div>
    </form>
  );
}

export default Register;
