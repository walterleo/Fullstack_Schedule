import React from "react";
import axios from "axios";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      schedule: {
        taskemail: "",
        taskphone: "",
        taskname: "",
        deadline: "",
        notificationType: "",
        agree: false,
      },
    };
  }

  onChange = (e) => {
    if (e.target.name === "deadline") {
      this.setState({
        schedule: {
          ...this.state.schedule,
          [e.target.name]: new Date(e.target.value),
        },
      });
    } else {
      this.setState({
        schedule: {
          ...this.state.schedule,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  onSubmit = async (e) => {
    try {
      e.preventDefault();

      console.log(this.state.schedule);
      const res = await axios.post("/api/user/task", this.state.schedule);
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className="container">
          <h1>Scheduler App</h1>
          <hr />

          <label htmlFor="taskname">
            <b>Task Name</b>
          </label>
          <input
            type="text"
            placeholder="Enter your taskname"
            name="taskname" onChange={this.onChange}
          />

          <label htmlFor="deadline">
            <b>Deadline</b>
          </label>
          <input
            type="datetime-local"
            placeholder="Enter your Task Deadline"
            name="deadline" onChange={this.onChange}
          />
          <label htmlFor="notificationType">Notification Type</label>

          <select name="notificationType" onChange={this.onChange}>
            <option value="">Choose your Notification Type</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="both">Both</option>
          </select>
          <hr />
          <input type="checkbox" name="agree" onChange={this.onChange} value={this.state.schedule.agree}></input>

          <label htmlFor="agree">
            {" "}
            By clicking Schedule Job Button below, you agree to receive emails
            and messages as reminder notifications
          </label>

          <button type="submit" className="registerbtn">
            Schedule Job
          </button>
        </div>
      </form>
    );
  }
}

export default Dashboard;
