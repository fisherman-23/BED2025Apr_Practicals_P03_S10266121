const express = require("express");
const app = express();
const PORT = 3000;

let userData = {
  name: "Alex",
  hobbies: ["coding", "reading", "cycling"],
  intro: "Hi, I'm Alex, a Year 2 student passionate about building APIs!",
};

app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

app.get("/intro", (req, res) => {
  res.send(`${userData.intro}`);
});

app.get("/name", (req, res) => {
  res.send(`My name is ${userData.name}`);
});

app.get("/hobbies", (req, res) => {
  res.json(userData.hobbies);
});

app.get("/food", (req, res) => {
  res.send("My favourite food is Chicken Rice");
});

app.get("/student", (req, res) => {
  res.json(userData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
