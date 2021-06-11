const Router = require("express");
const {
  checkAuthenticationToken,
} = require("../middleware/auth.middleware.js");
const UserController = require("../controllers/user.controller");

const router = Router();
const controller = UserController.getInstance();

/* User routes */
router.get("/relations/:uid", controller.getAllUserRelations);

router.get("/locations/:id", controller.getUsersLocation);

router.put("/user/location/:uid", controller.updateLocation);

/* Friendships routes */
router.get("/friendships/:uid", controller.getAllFriendships);

router.delete("/friendships/:id", controller.deleteFriendship);

/* Friend requests routes */
router.get("/friendRequests/:uid", controller.getAllFriendRequests);

router.post("/friendRequests", controller.sendFriendRequest);

router.post("/friendRequests/:id", controller.acceptFriendRequest);

router.delete("/friendRequests/:id", controller.rejectFriendRequest);

/* Belongs To */
router.get("/belongsTo/groups/:uid", controller.getGroups);

router.post("/belongsTo", controller.addToGroup);

router.get("/belongsTo/:uid/:groupId", controller.getSchedule);

router.put("/belongsTo/:uid", controller.changeSchedule);

module.exports = router;
