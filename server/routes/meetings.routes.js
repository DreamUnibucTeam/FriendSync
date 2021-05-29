const Router = require("express");
const {
  checkAuthenticationToken,
} = require("../middleware/auth.middleware.js");
const MeetingController = require("../controllers/meeting.controller");

const router = Router();
const controller = MeetingController.getInstance();

router.get("/userMeetings/:uid", controller.getUserScheduledMettings);

/* Meeting routes */
router.get("/meeting/:id", controller.getMeeting);

router.get("/group/:id", controller.getAllMeetings);

router.post("/meeting", controller.createMeeting);

router.delete("/meeting/:id", controller.removeMeeting);

router.put("/meeting/schedule/:id", controller.getBestInterval);

router.put("/meeting/setSchedule/:id", controller.setSchedule);

router.put("/meeting/location/:id", controller.setLocation);

router.put("/meeting/activity/:id", controller.selectActivity);

router.get(
  "/meeting/votingstatus/:groupId/:meetingId",
  controller.getVotingStatus
);

/* Activity routers */
router.get("/activity/:id", controller.getAllActivities);

router.post("/activity", controller.createActivity);

router.put("/activity/addvote/:id", controller.addVote);

router.put("/activity/removevote/:id", controller.removeVote);

module.exports = router;
