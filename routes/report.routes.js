const Router = require("express");
const { Octokit } = require("@octokit/core");
const {
  checkAuthenticationToken,
} = require("../middleware/auth.middleware.js");
require("dotenv").config();

const router = Router();
const octokit = new Octokit({ auth: `${process.env.GH_API_TOKEN}` });
const owner = "DreamUnibucTeam";
const repo = "FriendSync";

// TODO: Add checkAuthenticationToken
router.post("/bug", async (req, res) => {
  try {
    const issue = req.body;
    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner: owner,
        repo: repo,
        ...issue,
      }
    );

    if (response.status === 201) {
      return res.status(201).json({
        message: "Successfully recorded the issue",
        location: response.headers.location,
        number: response.data.number,
      });
    } else {
      return res.status(response.status).json({
        message: "Error @/api/report/bug",
      });
    }
  } catch (error) {
    console.log("Error @/api/report/bug: ", error.message);
    res
      .status(response.status ?? 500)
      .json({ message: "Error @/api/report/bug: " + error.message });
  }
});

module.exports = router;
