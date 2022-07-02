import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
function ScheduleTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({
    taskname: "",
    deadline: "",
    notificationType: "",
    agree: false,
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    if (e.target.name === "deadline") {
      setTasks({
        ...tasks,
        [e.target.name]: new Date(e.target.value),
      });
    } else if (e.target.name === "agree") {
      setTasks({
        ...tasks,
        agree: e.target.checked,
      });
    } else {
      setTasks({
        ...tasks,
        [e.target.name]: e.target.value,
      });
    }
  };

  const back = () => {
    
    navigate("/dashboard");
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!tasks.agree) return alert("Please accept Terms");
      console.log(tasks);
      const res = await axios.post("/api/tasks/add", tasks, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <>
        <nav>
          <h2>
            <button
              type="submit"
              className="btn2"
              style={{ backgroundColor: "grey", float: "left" }}
              onClick={back}
            >
              Go Back
            </button>
          </h2>
        </nav>
      <div className="container2" style={{ marginTop: "2%" }}>
        <form onSubmit={onSubmit}>
          <div className="container">
            <h1>Scheduler App</h1>
            <hr />

            <label htmlFor="taskname">
              <b>Task Name</b>
            </label>
            <input
              type="text"
              placeholder="Enter your taskname"
              name="taskname"
              value={tasks.taskname}
              onChange={onChange}
            />

            <label htmlFor="deadline">
              <b>Deadline</b>
            </label>
            <input
              type="datetime-local"
              placeholder="Enter your Task Deadline"
              name="deadline"
              onChange={onChange}
            />
            <label htmlFor="notificationType">Notification Type</label>

            <select name="notificationType" onChange={onChange}>
              <option value="">Choose your Notification Type</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="both">Both</option>
            </select>
            <hr />
            <input
              type="checkbox"
              name="agree"
              onChange={onChange}
              value={tasks.agree}
            ></input>

            <label htmlFor="agree">
              {" "}
              By clicking Schedule Job Button below, you agree to receive emails
              and messages as reminder notifications
            </label>

            <button type="submit" className="registerbtn">
              Schedule Job
            </button>
            <button type="submit" className="logoutbtn" onClick={removeToken}>
              Log out
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ScheduleTasks;
