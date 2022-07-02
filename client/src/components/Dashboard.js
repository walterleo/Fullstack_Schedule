import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

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
          <button type="submit" className="btn2" onClick={schedule}>
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
            <tbody>{userData && userData.tasks.map((ele,index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{ele.taskname}</td>
                <td>{Date(ele.deadline)}</td>
                <td>{ele.notificationType}</td>
                <td>{ele.isCompleted ? 'true' : 'false'}</td>
                <td><button className="btn2" >Edit</button></td>
                <td><button className="btn2" style={{color: "red", backgroundColor: "white"}} >Delete</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
