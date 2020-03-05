const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

if (process.env.NODE_ENV != "production") dotenv.config();

connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Welcome to CZ2006 COBLIMA</h1>");
});

app.listen(5000, () => {
  console.log("Appa running on port 5000");
});
