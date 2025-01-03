import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
const port = 8000;

//configure
app.use(cors());


mongoose.connect('mongodb+srv://krishnasarwe:S6TBvY5g8H1ZgNUU@cluster0.6dqwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
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
