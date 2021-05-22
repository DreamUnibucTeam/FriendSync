const Router = require("express");
const {
  checkAuthenticationToken,
} = require("../middleware/auth.middleware.js");
const GroupController = require("../controllers/group.controller");

const router = Router();
const controller = GroupController.getInstance();

/* Group routes */
router.get("/group/:id", controller.getGroup);

router.post("/group", controller.createGroup);

router.delete("/group/:id", controller.removeGroup);

router.get("/group/:id/members", controller.getAllMembers);

module.exports = router;
