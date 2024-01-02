import express from "express";

import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 8001;

// Configure
app.use(cors());

// Connect to MongoDB
mongoose.connect("");
const db = mongoose.connection;

// Check MongoDB connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import photosRouter from "./controller/photosController.js";

app.use("/api/photo", photosRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
