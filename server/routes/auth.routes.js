const Router = require("express");
const {
  checkAuthenticationToken,
} = require("../middleware/auth.middleware.js");

const router = Router();

router.post("/login", (req, res) => {});

router.post("/register", (req, res) => {});

/* Test API CALL */
router.get("/test", checkAuthenticationToken, async (req, res) => {
  try {
    console.log("Hello");
    const uid = req.user.uid;
    console.log(uid);
    res.status(200).json({ message: "Succesfuly received message: " + uid });
  } catch (error) {
    console.log("Error @/api/auth/test: ", error.message);
    res
      .status(401)
      .json({ message: "Error @/api/auth/test: " + error.message });
  }
});

module.exports = router;
