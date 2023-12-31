const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 8004;
const logFilePath = path.join(__dirname, "logs.txt");

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to receive log messages via POST request
app.post("/log", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const logEntry = `${new Date().toISOString()} - ${message}\n`;

  // Append the log entry to the file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Log entry added:", logEntry);
    res.json({ message: "Log entry added successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Logging microservice is running on port ${port}`);
});
