import express from "express";
const app = express();

const port = process.env.PORT || 5000;
import "./dbConnect.js";

//import routers
import tasksRouter from "./controllers/tasks.js";
import userRouter from "./controllers/users.js";

app.use(express.json());
app.use("/api/tasks", tasksRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
