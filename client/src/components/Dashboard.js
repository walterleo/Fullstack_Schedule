import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({
    taskname: "",
    deadline: "",
    notificationType: "",
    isCompleted: "",
  });
  const [isEdit, setisEdit] = useState(false);

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

  const onChange = (e) => {
    if (e.target.name === "deadline") {
      setTasks({
        ...tasks,
        [e.target.name]: new Date(e.target.value),
      });
    }  else {
      setTasks({
        ...tasks,
        [e.target.name]: e.target.value,
      });
    }
  };
  const schedule = () => {
    navigate("/add");
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deletejob = async (taskid) => {
    try {
      const res = await axios.delete(`/api/tasks/${taskid}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.data.message) {
        alert(res.data.message);
      } else {
        alert(res.data.success);
      }
      window.location.reload();
    } catch (error) {
      alert(error.response.data.error);
      window.location.reload();
    }
  };

  const isGonnaEdit = () => {
    setisEdit(true);
  };
  const isGonnaSave = async (taskid) => {
    try{
      
      setisEdit(false);    
     
      const res = await axios.put(`/api/tasks/${taskid}`, tasks, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      if (res.data.message) {
        alert(res.data.message);
      } else {
        alert(res.data.success);
      }
      window.location.reload();

    }catch(error){
      console.log(error);
    }
    
  };
  const convertDate = (date) => {
    let newdate = new Date(date);
    return newdate.toString();
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
          {userData && userData.tasks.length == 0 ? (
            <>
              <h1 style={{ textAlign: "center" }}>
                {" "}
                There are no Jobs currently
              </h1>
            </>
          ) : (
            <>
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
                {isEdit ? (
                  <tbody>
                    {userData &&
                      userData.tasks.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td width={"40%"}>
                            <input
                              type="text"
                              placeholder="Enter your taskname"
                              name="taskname"
                              
                              onChange={onChange}
                            />
                          </td>
                          <td width={"20%"}>
                            <input
                              type="datetime-local"
                              placeholder="Enter your Task Deadline"
                              name="deadline"
                              onChange={onChange}
                            />
                          </td>
                          <td width={"20%"}>
                            <select name="notificationType"  onChange={onChange}>
                              <option value="">
                                Choose your Notification Type
                              </option>
                              <option value="sms">SMS</option>
                              <option value="email">Email</option>
                              <option value="both">Both</option>
                            </select>
                          </td>
                          <td width={"30%"}>
                            <select name="isCompleted" onChange={onChange}>
                            <option value="">Choose your Task status</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </td>
                          <td>
                            <button className="btn2" onClick={isGonnaSave} onClick={() => isGonnaSave(ele._id)}>
                              Save
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn2"
                              style={{ color: "red", backgroundColor: "white" }}
                              onClick={() => deletejob(ele._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                ) : (
                  <tbody>
                    {userData &&
                      userData.tasks.map((ele, index) => (
                        <tr key={index}>
                          <td>{ele._id}</td>
                          <td>{ele.taskname}</td>
                          <td>{convertDate(ele.deadline)}</td>
                          <td>{ele.notificationType}</td>
                          <td>{ele.isCompleted ? "true" : "false"}</td>
                          <td>
                            <button className="btn2" onClick={isGonnaEdit}>
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn2"
                              style={{ color: "red", backgroundColor: "white" }}
                              onClick={() => deletejob(ele._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
