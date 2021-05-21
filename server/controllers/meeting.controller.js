const { auth, db } = require("../firebase/firebase.admin.js");
const moment = require("moment");

const MeetingController = (() => {
  /* Intanta care salveaza referinta controller-ului */
  let instance = null;

  const init = () => {
    /* Private functions */

    /* Public functions */
    return {
      /* Meeting */
      createMeeting: async (req, res) => {
        try {
          const { name, groupId, startInterval, endInterval, duration } =
            req.body;
          const result = await db.collection("meetings").add({
            name,
            groupId,
            startInterval,
            endInterval,
            duration,
            isScheduled: true,
          });

          res
            .status(200)
            .json({ message: "Meeting has been successfully created" });
        } catch (error) {
          console.log(
            "Error @MeetingsController/createMeeting: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },

      getAllMeetings: async (req, res) => {
        try {
          const id = req.params.id;

          const meetingsQuery = await db
            .collection("meetings")
            .where("groupId", "==", id)
            .get();
          const meetings = [];
          if (!meetingsQuery.empty) {
            meetingsQuery.forEach((meeting) => {
              meetings.push({
                id: meeting.id,
                ...meeting.data(),
              });
            });
          }
          res.status(200).json({ meetings });
        } catch (error) {
          console.log(
            "Error @MeetingsController/getAllMeetings: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },
      getMeeting: async (req, res) => {
        try {
          const id = req.params.id;

          const meetingSnapshot = await db.collection("meetings").doc(id).get();
          if (meetingSnapshot.exists) {
            meeting = {
              id: meetingSnapshot.id,
              ...meetingSnapshot.data(),
            };
            return res.status(200).json({ meeting });
          }
          return res
            .status(500)
            .json({ message: "Meeting does not exist or has been deleted" });
        } catch (error) {
          console.log("Error @MeetingsController/getMeeting: ", error.message);
          res.status(500).json({ message: error.message });
        }
      },

      /* Activity */
      getAllActivities: async (req, res) => {
        try {
          const id = req.params.id;

          const activitiesQuery = await db
            .collection("activities")
            .where("meetingId", "==", id)
            .get();
          const activities = [];
          if (!activitiesQuery.empty) {
            activitiesQuery.forEach((activity) => {
              activities.push({
                id: activity.id,
                ...activity.data(),
              });
            });
          }
          res.status(200).json({ activities });
        } catch (error) {
          console.log(
            "Error @MeetingsController/getAllActivities: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },

      createActivity: async (req, res) => {
        try {
          const { name, meetingId } = req.body;
          const result = await db.collection("activities").add({
            name,
            meetingId,
            votesNumber: 0,
            votes: [],
          });

          res
            .status(200)
            .json({ message: "Activity has been successfully created" });
        } catch (error) {
          console.log(
            "Error @MeetingsController/createActivity: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },

      /* Voting */
      addVote: async (req, res) => {
        try {
          const activityId = req.params.id;
          const { uid } = req.body;
          const activityRef = db.collection("activities").doc(activityId);
          const activitySnapshot = await activityRef.get();

          if (activitySnapshot.exists) {
            if (activitySnapshot.data().votes.includes(uid)) {
              return res.status(500).json({
                message: "This user has voted already for this activity",
              });
            }

            const { newVotes } = activitySnapshot.data();
            newVotes.push(uid);
            const result = await activityRef.update({
              votesNumber: votesNumber + 1,
              votes: newVotes,
            });

            return res
              .status(200)
              .json({ succes: true, message: "Vote has been submited" });
          }

          return res
            .status(500)
            .json({ message: "Activity doesn't exist or has been removed" });
        } catch (error) {
          console.log("Error @MeetingsController/addVote: ", error.message);
          res.status(500).json({ message: error.message });
        }
      },

      removeVote: async (req, res) => {
        try {
          const activityId = req.params.activityId;
          const { uid } = req.body;
          const activityRef = db.collection("activities").doc(activityId);
          const activitySnapshot = await activityRef.get();

          if (activitySnapshot.exists) {
            if (!activitySnapshot.data().votes.includes(uid)) {
              return res.status(500).json({
                message: "This user has not voted already for this activity",
              });
            }

            const { newVotes } = activitySnapshot.data();
            newVotes = newVotes.filter((id) => id !== uid);
            const result = await activityRef.update({
              votesNumber: votesNumber - 1,
              votes: newVotes,
            });

            return res
              .status(200)
              .json({ succes: true, message: "Vote has been retracted" });
          }

          return res
            .status(500)
            .json({ message: "Activity doesn't exist or has been removed" });
        } catch (error) {
          console.log("Error @MeetingsController/removeVote: ", error.message);
          res.status(500).json({ message: error.message });
        }
      },

      /* Algoritmul de scheduling */
      getBestInterval: async (req, res) => {
        try {
          const { meetingId } = req.body;
          const meetingRef = db.collection("meetings").doc(meetingId);
          const meetingSnapshot = await meetingRef.get();
          if (!meetingSnapshot.exists) {
            return res
              .status(500)
              .json({ message: "Meeting doesn't exist or has been removed" });
          }

          const { groupId, startInterval, endInterval, duration } =
            meetingSnapshot.data();

          const groupUsersQuery = await db
            .collection("belongsTo")
            .where("groupId", "==", groupId)
            .get();

          const schedules = [];
          /* 
            Un schedule arata in felul următor: [
              {
                startTime: timestamp1,
                endTime: timestamp2
              }
            ]
        */
          groupUsersQuery.forEach((user) => {
            const userSchedule = user.data().schedule;
            const goodScheduleIntervals = userSchedule.filter((schedule) => {
              return (
                startInterval <= schedule.startTime &&
                schedule.endTime <= endInterval &&
                moment(startTime).add({ hours: duration }).unix() <=
                  schedule.endTime
              );
            });
            schedules.push({
              user: user.userUid,
              intervals: goodScheduleIntervals,
            });
          });

          let startTimestamp = startInterval;
          let endTimestamp = moment(startInterval)
            .add({ hours: duration })
            .unix();

          let bestInterval = [startTimestamp, endTimestamp];
          let bestNumOfUsers = 0;
          while (endTimestamp <= endInterval) {
            let bestCurrent = 0;
            for (const sched of schedules) {
              const { user, intervals } = sched;
              const isGoodInterval = intervals.some((interval) => {
                return (
                  interval.startTime <= startTimestamp &&
                  endTimestamp <= interval.endTime
                );
              });

              if (isGoodInterval) bestCurrent++;
            }

            if (bestCurrent > bestNumOfUsers) {
              bestNumOfUsers = bestCurrent;
              bestInterval = [startTimestamp, endTimestamp];
            }
            startTimestamp = moment(startTimestamp).add({ minutes: 15 }).unix();
            endTimestamp = moment(endTimestamp).add({ minutes: 15 }).unix();
          }

          const result = meetingRef.update({ time: bestInterval });
          return res
            .status(200)
            .json({ message: "Meeting has been succesfully scheduled" });
        } catch (error) {
          console.log(
            "Error @MeetingsController/getBestInterval: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },

      setLocation: async (req, res) => {
        try {
          const id = req.params.id;
          const { coordonate } = req.body;
          const meetingRef = db.collection("meetings").doc(id);
          const meetingSnapshot = await meetingRef.get();
          if (!meetingSnapshot.exists) {
            return res
              .status(500)
              .json({ message: "Meeting doesn't exist or has been removed" });
          }

          const result = await meetingRef.update({ location: coordonate });
          return res
            .status(200)
            .json({ message: "Meeting location has been succesfully set" });
        } catch (error) {
          console.log("Error @MeetingsController/setLocation: ", error.message);
          res.status(500).json({ message: error.message });
        }
      },
    };
  };

  return {
    getInstance: function () {
      if (!instance) instance = init();
      return instance;
    },
  };
})();

module.exports = MeetingController;

/*

  schedules = [{sched}, {sched}, {sched}]
  sched = { user, intervals: [{}, {}, {}]}

*/

/*
    Meeting Controller

    # crearea unui meeting (interval, durata)
    # get meetings

    # get activities (default)
    # propune activitate
    
    # voteaza activitate
    # adminul sa aiba un buton de stabilire a meetingului (sa calculam cand, activitatea si sa stabileasca locatia)
*/

// const zi = moment().add({ hours: 4 });
// console.log(zi.unix());
