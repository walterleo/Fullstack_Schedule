import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();


  const [taskData, setTasksData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    
    async function fetchData() {
      try {
        const res = await axios.get("/api/tasks", {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        setUserData(res.data.taskData);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
    fetchData();
  }, []);

  const schedule = () => {
    
    navigate("/add");
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav>
        <h2>
          <button
            type="submit"
            className="btn2"
            style={{ backgroundColor: "grey" }}
            onClick={removeToken}
          >
            Log out
          </button>
          <button type="submit" className="btn2" onClick={schedule} >
            Schedule Job
          </button>
        </h2>
      </nav>
      <div>
        <h1 style={{ textTransform: "capitalize" }}>
          Hello {userData && userData.firstname} !
        </h1>
        <div className="container2">
          <h1 style={{ textAlign: "center" }}> All Scheduled Jobs</h1>
          <hr />
          <table id="tasklist">
          <thead>
            <tr>
              <th>_id</th>
              <th>Task Name</th>
              <th>Deadline</th>
              <th>Notification Type</th>
              <th>Task Status</th>
              <th>Edit</th>
              <th> Delete</th>
            </tr>
          </thead>
          <tbody>
      {/* {taskData.map((ele) => (
        <tr key={ele.taskData.user}>
        <td>{ele.taskData.taskname}</td>
        <td>{ele.taskData.deadline}</td>
        <td>{ele.taskData.isCompleted}</td>
        <td>{ele.taskData.notificationType}</td>
       
        </tr>
       ))
      } */}
         </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
