import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
const port = 8000;

//configure
app.use(cors());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://ahmadareeb3026:1234@cluster0.u0yv2iy.mongodb.net/cloud_auth_svc?retryWrites=true&w=majority"
);
const db = mongoose.connection;

// Check MongoDB connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import userRouter from "./routes/userRoute.js";

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
