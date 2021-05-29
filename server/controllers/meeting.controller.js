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
            isScheduled: false,
            voted: [],
          });

          const meetingId = result.id;
          res.status(200).json({
            message: "Meeting has been successfully created",
            meetingId,
          });
        } catch (error) {
          console.log(
            "Error @MeetingsController/createMeeting: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },

      getUserScheduledMettings: async (req, res) => {
        try {
          const uid = req.params.uid;
          const groupsQuery = await db
            .collection("belongsTo")
            .where("userUid", "==", uid)
            .get();
          const groupsIds = [];
          if (!groupsQuery.empty) {
            groupsQuery.forEach((group) => {
              groupsIds.push(group.data().groupId);
            });
          }

          const meetings = [];
          for (const groupId of groupsIds) {
            const groupSnap = await db.collection("groups").doc(groupId).get();
            if (!groupSnap.exists)
              return res
                .status(500)
                .json({ message: "Group does not exist or has been deleted" });

            const meetingsQuery = await db
              .collection("meetings")
              .where("groupId", "==", groupId)
              .get();
            if (!meetingsQuery.empty) {
              meetingsQuery.forEach((meeting) => {
                if (meeting.data().isScheduled) {
                  meetings.push({
                    id: meeting.id,
                    ...meeting.data(),
                    groupName: groupSnap.data().name,
                  });
                }
              });
            }
          }

          res.status(200).json({ meetings });
        } catch (error) {
          console.log(
            "Error @MeetingsController/getUserScheduledMettings: ",
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

      removeMeeting: async (req, res) => {
        try {
          const meetingId = req.params.id;
          const { uid, groupId } = req.body;

          const groupSnap = await db.collection("groups").doc(groupId).get();
          if (!groupSnap.exists) {
            return res
              .status(500)
              .json({ message: "Group does not exist or has been deleted" });
          }
          if (groupSnap.data().owner !== uid) {
            return res.status(500).json({
              message: "You don't have enough permissions to do this operation",
            });
          }

          const meetRef = db.collection("meetings").doc(meetingId);
          const meetSnap = await meetRef.get();
          if (!meetSnap.exists) {
            return res
              .status(500)
              .json({ message: "Meeting does not exist or has been deleted" });
          }
          const result = await meetRef.delete();

          const activitiesQuery = await db
            .collection("activities")
            .where("meetingId", "==", meetingId)
            .get();
          const actId = [];
          if (!activitiesQuery.empty) {
            activitiesQuery.forEach((activity) => {
              actId.push(activity.id);
            });
          }
          for (const activityId of actId) {
            const result = await db
              .collection("activities")
              .doc(activityId)
              .delete();
          }

          res
            .status(200)
            .json({ message: "The meeting has been successfully removed" });
        } catch (error) {
          console.log(
            "Error @MeetingsController/removeMeeting: ",
            error.message
          );
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

          const activityId = result.id;
          res.status(200).json({
            message: "Activity has been successfully created",
            activityId,
          });
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

            const votes = [...activitySnapshot.data().votes];
            const votesNumber = activitySnapshot.data().votesNumber;
            const result = await activityRef.update({
              votesNumber: votesNumber + 1,
              votes: [...votes, uid],
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

      getVotingStatus: async (req, res) => {
        try {
          const groupId = req.params.groupId;
          const meetingId = req.params.meetingId;

          const groupQuery = await db
            .collection("belongsTo")
            .where("groupId", "==", groupId)
            .get();
          const meetingSnap = await db
            .collection("meetings")
            .doc(meetingId)
            .get();

          if (!groupQuery.empty && meetingSnap.exists) {
            const totalMembers = groupQuery.size;
            const totalVoters = meetingSnap.data().voted.length;
            const voters = meetingSnap.data().voted;
            return res.status(200).json({ totalMembers, totalVoters, voters });
          }
          return res.status(500).json({
            message: "Group or meeting does not exist or has been deleted",
          });
        } catch (error) {
          console.log(
            "Error @MeetingsController/getVotingStatus: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },

      /* Algoritmul de scheduling */
      getBestInterval: async (req, res) => {
        try {
          const meetingId = req.params.id;
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
                startDate: timestamp1,
                endDate: timestamp2
              }
            ]
        */
          groupUsersQuery.forEach((user) => {
            const userSchedule = user.data().schedule;
            const goodScheduleIntervals = userSchedule.filter((schedule) => {
              return (
                startInterval <= schedule.startDate &&
                schedule.endDate <= endInterval &&
                moment(schedule.startDate)
                  .add({ hours: duration.hours, minutes: duration.minutes })
                  .valueOf() <= schedule.endDate
              );
            });
            schedules.push({
              user: user.data().userUid,
              intervals: goodScheduleIntervals,
            });
          });

          let startTimestamp = startInterval;
          let endTimestamp = moment(startInterval)
            .add({ hours: duration.hours, minutes: duration.minutes })
            .valueOf();

          let bestInterval = [startTimestamp, endTimestamp];
          let bestNumOfUsers = 0;
          while (endTimestamp <= endInterval) {
            let bestCurrent = 0;
            for (const sched of schedules) {
              const { user, intervals } = sched;
              const isGoodInterval = intervals.some((interval) => {
                return (
                  interval.startDate <= startTimestamp &&
                  endTimestamp <= interval.endDate
                );
              });

              if (isGoodInterval) bestCurrent++;
            }

            if (bestCurrent > bestNumOfUsers) {
              bestNumOfUsers = bestCurrent;
              bestInterval = [startTimestamp, endTimestamp];
            }
            startTimestamp = moment(startTimestamp)
              .add({ minutes: 15 })
              .valueOf();
            endTimestamp = moment(endTimestamp).add({ minutes: 15 }).valueOf();
          }

          if (bestNumOfUsers > 0) {
            const result = await meetingRef.update({
              time: bestInterval,
              isScheduled: true,
            });
            return res.status(200).json({
              status: "scheduled",
              message: "Meeting has been succesfully scheduled",
            });
          } else {
            return res.status(200).json({
              status: "not-scheduled",
              message:
                "Couldn't find any good time intervals based on users' schedules",
            });
          }
        } catch (error) {
          console.log(
            "Error @MeetingsController/getBestInterval: ",
            error.message
          );
          res.status(500).json({ message: error.message });
        }
      },

      setSchedule: async (req, res) => {
        try {
          const id = req.params.id;
          const { interval } = req.body;
          const meetingRef = db.collection("meetings").doc(id);
          const meetingSnapshot = await meetingRef.get();
          if (!meetingSnapshot.exists) {
            return res
              .status(500)
              .json({ message: "Meeting doesn't exist or has been removed" });
          }

          const result = await meetingRef.update({
            time: interval,
            isScheduled: true,
          });
          return res
            .status(200)
            .json({ message: "Meeting has been succesfully scheduled" });
        } catch (error) {
          console.log("Error @MeetingsController/setSchedule: ", error.message);
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

      selectActivity: async (req, res) => {
        try {
          const meetingId = req.params.id;
          const activitiesQuery = await db
            .collection("activities")
            .where("meetingId", "==", meetingId)
            .get();
          if (activitiesQuery.empty) {
            return res.status(500).json({
              message: "There are no proposed activities for your meeting",
            });
          }

          let topVotedActivities = [];
          let topVotes = -1;
          activitiesQuery.forEach((activity) => {
            if (activity.data().votesNumber > topVotes) {
              topVotes = activity.data().votesNumber;
              topVotedActivities = [
                { id: activity.id, name: activity.data().name },
              ];
            } else if (activity.data().votesNumber === topVotes) {
              topVotedActivities.push({
                id: activity.id,
                name: activity.data().name,
              });
            }
          });

          let selected = null;
          if (topVotedActivities.length === 1) {
            selected = topVotedActivities[0];
          } else {
            const idx = Math.floor(Math.random() * topVotedActivities.length);
            selected = topVotedActivities[idx];
          }

          const result = await db
            .collection("meetings")
            .doc(meetingId)
            .update({ activity: selected });
          res
            .status(200)
            .json({ message: "The activity has been selected successfully" });
        } catch (error) {
          console.log(
            "Error @MeetingsController/selectActivity: ",
            error.message
          );
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
// console.log(zi.valueOf());
