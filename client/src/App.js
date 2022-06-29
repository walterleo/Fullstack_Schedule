import React from "react";
import {Routes, Route} from "react-router-dom";
import "./App.css";




import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Error from "./components/Error";
import ScheduleTasks from "./components/ScheduleTasks";
import Dashboard from "./components/Dashboard";


function App(){
  return(
    <Routes >
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/user/verifyerror/" element={<Error />}></Route>
      <Route path="/add" element={<ScheduleTasks />}></Route>
     
    </Routes>
  );
}

export default App;