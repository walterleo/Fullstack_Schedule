import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      register: {
        firstname: "",
        email: "",
        password: "",
        passwordrepeat: "",
        phone: "",
        address: "",
      },
    };
  }

  onChange = (e) => {
    this.setState({
      register: {
        ...this.state.register,
        [e.target.name]: e.target.value,
      },
    });
  };

  onSubmit = async (e) => {
    try {
      e.preventDefault();

      let navigate = useNavigate();

      console.log(this.state.register);
      const res = await axios.post("/api/users/register", this.state.register);
      navigate("/login");
    } catch (error) {
      let navigate = useNavigate();

      console.log(error.response.data);
      navigate("/login");
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
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
            onChange={this.onChange}
          />

          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            onChange={this.onChange}
          />

          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={this.onChange}
          />

          <label htmlFor="password-repeat">
            <b>Confirm Password</b>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            name="passwordrepeat"
            onChange={this.onChange}
          />

          <label htmlFor="phone">
            <b>Phone</b>
          </label>
          <input
            type="tel"
            placeholder="Enter your contact number"
            name="phone"
            onChange={this.onChange}
          />

          <label htmlFor="address">
            <b>Address</b>
          </label>
          <textarea
            placeholder="Enter your address"
            name="address"
            rows="4"
            cols="50"
            onChange={this.onChange}
          />
          <hr />
          <p>
            By creating an account you agree to our{" "}
            <a href="#">Terms & Privacy</a>.
          </p>

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
}

export default Register;
