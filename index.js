const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Welcome to CZ2006 COBLIMA</h1>");
});

app.listen(5000, () => {
  console.log("Appa running on port 5000");
});
