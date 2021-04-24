const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT ?? 8000;

/* API Routes */
app.use("/api/auth", require(path.join(__dirname, "router", "auth.router.js")));

app.get("/", (req, res) => {
  res.send("REST API Server for FriendSync application");
});

app.listen(PORT, () => {
  console.log("Server has started on port 8000");
});
