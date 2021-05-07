const express = require("express");
const path = require("path");
const { admin, db } = require("./firebase/firebase.admin");
require("dotenv").config();

/* Server constants */
const app = express();

const PORT = process.env.PORT ?? 8000;

/* Middlewares */
app.use(express.json({ extended: true }));

/* API Routes */
app.use("/api/auth", require(path.join(__dirname, "routes", "auth.routes.js")));

app.get("/", (req, res) => {
  res.send("REST API Server for FriendSync application");
});

/* Server listening */
app.listen(PORT, () => {
  console.log("Server has started on port 8000");
});
