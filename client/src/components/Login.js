import React from "react";
import {Link} from "react-router-dom";





class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      login: {
        
        email: "",
        password: ""
        
      },
    };
  }


  onChange = (e) => {   
    // console.log(e.target.value);
    
      this.setState({
        login: {

            
          ...this.state.login,
          [e.target.name]: e.target.value,
        },
      });   
     
    };

    onSubmit = (e) => {
        
          e.preventDefault();    
          console.log(this.state.login);          
        //   console.log(res.data);
        // } catch (error) {
        //   console.log(error.response.data);
        // }
      };

  

  render() {
    return (
        <form onSubmit={this.onSubmit} >
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
            onChange={this.onChange}
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
            onChange={this.onChange}
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
}


export default Login;
