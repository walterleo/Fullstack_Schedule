import React from "react";
import { useParams } from "react-router-dom";
function Verify() {
  let params = useParams();
  console.log(params);
  return (
    <center>
      <div>
        <h1>User Email is successfully Verified</h1>
      </div>
    </center>
  );
}

export default Verify;
