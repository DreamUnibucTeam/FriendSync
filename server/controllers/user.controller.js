const { auth, db } = require("../firebase/firebase.admin.js");

const UserController = (() => {
  /* Intanta care salveaza referinta controller-ului */
  let instance = null;

  const init = () => {
    /* Private functions */
    const getUser = async (uid) => {
      try {
        const userSnapshot = await db.collection("users").doc(uid).get();
        if (userSnapshot.exists) {
          return { uid, ...userSnapshot.data() };
        }
      } catch (error) {
        return console.log("Error @UserController/getUser: ", error.message);
      }

      throw new Error(
        "Error @UserController/getUser: User does not exist or has been deleted"
      );
    };

    const addFriendship = async (uid1, uid2) => {
      try {
        const startDate = new Date().toString();
        const response = await db
          .collection("friendships")
          .add({ uid1, uid2, startDate });
        return response;
      } catch (error) {
        return console.log(
          "Error @UserController/addFriendship: ",
          error.message
        );
      }
    };

    /* Public functions */
    return {
      /* Users */
      getAllUserRelations: async (req, res) => {
        try {
          const uid = req.params.uid;
          const usersQuery = await db.collection("users").get();

          const userIds = [];
          if (!usersQuery.empty) {
            usersQuery.forEach((user) => {
              userIds.push(user.id);
            });
          }

          const userRelations = {};
          /* Friend requests from users */
          const receivedRequestsQuery = await db
            .collection("friendRequests")
            .where("toUid", "==", uid)
            .get();
          if (!receivedRequestsQuery.empty) {
            receivedRequestsQuery.forEach((received) => {
              const userUid = received.data().fromUid;
              userRelations[userUid] = {
                relation: "Received Friend Request",
                relationId: received.id,
              };
            });
          }

          /* Friend requests sent */
          const sentRequestsQuery = await db
            .collection("friendRequests")
            .where("fromUid", "==", uid)
            .get();
          if (!sentRequestsQuery.empty) {
            sentRequestsQuery.forEach((sent) => {
              const userUid = sent.data().toUid;
              userRelations[userUid] = {
                relation: "Sent Friend Request",
                relationId: sent.id,
              };
            });
          }

          /* Friendships */
          const friendshipQuery1 = await db
            .collection("friendships")
            .where("uid1", "==", uid)
            .get();
          if (!friendshipQuery1.empty) {
            friendshipQuery1.forEach((friend) => {
              const userUid = friend.data().uid2;
              userRelations[userUid] = {
                relation: "Friends",
                relationId: friend.id,
              };
            });
          }

          const friendshipQuery2 = await db
            .collection("friendships")
            .where("uid2", "==", uid)
            .get();
          if (!friendshipQuery2.empty) {
            friendshipQuery2.forEach((friend) => {
              const userUid = friend.data().uid1;
              userRelations[userUid] = {
                relation: "Friends",
                relationId: friend.id,
              };
            });
          }

          const users = [];
          for (const userUid of userIds) {
            if (uid == userUid) continue;
            const userData = await getUser(userUid);
            users.push({
              userUid,
              displayName: userData.displayName,
              email: userData.email,
              profilePhotoUrl: userData.profilePhotoUrl,
              relation: userRelations[userUid],
            });
          }

          res.status(200).json({ users });
        } catch (error) {
          console.log(
            "Error @UserController/getAllUserRelations: ",
            error.message
          );
          return res
            .status(500)
            .json({ message: "Unable to update get all users" });
        }
      },

      updateLocation: async (req, res) => {
        const uid = req.params.uid;
        const coordonate = req.body;

        try {
          const userRef = db.collection("users").doc(uid);
          const response = await userRef.update({ location: coordonate });
          return res
            .status(200)
            .json({ message: "Succesfully updated user's location" });
          // return res.status(404).json({ message: "Unable to update user's location"});
        } catch (error) {
          console.log("Error @UserController/updateLocation: ", error.message);
          return res
            .status(500)
            .json({ message: "Unable to update user's location" });
        }
      },

      getUsersLocation: async (req, res) => {
        try {
          const usersQuery = await db.collection("users").get();

          const usersLocations = [];
          if (!usersQuery.empty) {
            usersQuery.forEach((user) => {
              if (user.data().location)
                usersLocations.push({
                  userUid: user.id,
                  location: user.data().location,
                  profilePhotoUrl: user.data().profilePhotoUrl,
                  name: user.data().displayName
                });
            });
          }

          return res.status(200).json({ usersLocations });
        } catch (error) {
          console.log(
            "Error @UserController/getUsersLocation: ",
            error.message
          );
          return res
            .status(500)
            .json({ message: "Unable to get users' location" });
        }
      },

      /* Friendships */
      getAllFriendships: async (req, res) => {
        try {
          const uid = req.params.uid;
          const friendshipsRef = db.collection("friendships");
          const friendshipsSnapshot1 = await friendshipsRef
            .where("uid1", "==", uid)
            .get();
          const friendshipsSnapshot2 = await friendshipsRef
            .where("uid2", "==", uid)
            .get();
          // 0NoemOL8jnZHT9RpgWyugfNDc5o2

          const userIds = [];
          if (!friendshipsSnapshot1.empty) {
            friendshipsSnapshot1.forEach((friendship) => {
              const friendUid = friendship.data().uid2;
              userIds.push({ friendUid, friendship });
            });
          }
          if (!friendshipsSnapshot2.empty) {
            friendshipsSnapshot2.forEach((friendship) => {
              const friendUid = friendship.data().uid1;
              userIds.push({ friendUid, friendship });
            });
          }

          const result = [];
          for (const { friendUid, friendship } of userIds) {
            const friendData = await getUser(friendUid);
            result.push({
              friendshipId: friendship.id,
              uid: friendUid,
              name: friendData.displayName,
              startDate: friendship.data().startDate,
              profilePhotoUrl: friendData.profilePhotoUrl,
            });
          }

          res.status(200).json({ friendships: result });
        } catch (error) {
          console.log("Error @UserController/getFriendships: ", error.message);
          return res.status(500).json({ message: error.message });
        }
      },

      deleteFriendship: async (req, res) => {
        try {
          const id = req.params.id;
          const result = await db.collection("friendships").doc(id).delete();
          res
            .status(200)
            .json({ message: "Friend has been remove successfully" });
        } catch (error) {
          console.log(
            "Error @UserController/deleteFriendship: ",
            error.message
          );
          return res.status(500).json({ message: error.message });
        }
      },

      /* Friend Requests */
      getAllFriendRequests: async (req, res) => {
        try {
          const uid = req.params.uid;
          const friendRequestsRef = db.collection("friendRequests");
          const friendRequestsSnapshot = await friendRequestsRef
            .where("toUid", "==", uid)
            .get();

          const userIds = [];

          // Attention that a where call returns a QuerySnapshot, not a simple Snapshot
          if (!friendRequestsSnapshot.empty) {
            friendRequestsSnapshot.forEach((friendRequest) => {
              const userUid = friendRequest.data().fromUid;
              userIds.push({ friendRequest, userUid });
            });
          }

          const result = [];
          for (const { friendRequest, userUid } of userIds) {
            const userData = await getUser(userUid);
            result.push({
              friendRequestId: friendRequest.id,
              uid: userUid,
              name: userData.displayName,
            });
          }

          res.status(200).json({ friendRequests: result });
        } catch (error) {
          console.log(
            "Error @UserController/getAllFriendRequests: ",
            error.message
          );
          return res.status(500).json({ message: error.message });
        }
      },

      sendFriendRequest: async (req, res) => {
        try {
          const { fromUid, toUid } = req.body;
          const sentDate = new Date().toString();
          const result = await db
            .collection("friendRequests")
            .add({ fromUid, toUid, sentDate });
          res
            .status(200)
            .json({ message: "Friend request has been successfully sent" });
        } catch (error) {
          console.log(
            "Error @UserController/sendFriendRequest: ",
            error.message
          );
          return res.status(500).json({ message: error.message });
        }
      },

      acceptFriendRequest: async (req, res) => {
        try {
          const id = req.params.id;
          const { uid1, uid2 } = req.body;
          const responseDel = await db
            .collection("friendRequests")
            .doc(id)
            .delete();
          const responseAdd = await addFriendship(uid1, uid2);
          if (responseAdd)
            res.status(200).json({ message: "New friendship has been made" });
          else
            res
              .status(500)
              .json({ message: "Error occured at adding friendship" });
        } catch (error) {
          console.log(
            "Error @UserController/acceptFriendRequest: ",
            error.message
          );
          return res.status(500).json({ message: error.message });
        }
      },

      rejectFriendRequest: async (req, res) => {
        try {
          const id = req.params.id;
          const response = await db
            .collection("friendRequests")
            .doc(id)
            .delete();
          res
            .status(200)
            .json({ message: "Friend request has been rejected successfully" });
        } catch (error) {
          console.log(
            "Error @UserController/rejectFriendRequest: ",
            error.message
          );
          return res.status(500).json({ message: error.message });
        }
      },

      /* BelongsTo */
      addToGroup: async (req, res) => {
        try {
          // const adminUid = req.user.uid
          const { adminUid, userUid, groupId } = req.body;
          // Vericare in BelongsTo daca e admin
          const adminSnapshot = await db
            .collection("groups")
            .doc(groupId)
            .get();
          if (adminSnapshot.exists && adminSnapshot.data().owner === adminUid) {
            const result = await db
              .collection("belongsTo")
              .add({ userUid, groupId, isAdmin: false, schedule: [] });
            return res.status(200).json({ message: "User added to group" });
          } else {
            return res
              .status(500)
              .json({ message: "You are not the admin of the group" });
          }
        } catch (error) {
          console.log("Error @UserController/getInGroup: ", error.message);
          return res.status(500).json({ message: error.message });
        }
      },

      changeSchedule: async (req, res) => {
        const { userUid, groupId, schedule } = req.body;
        try {
          const belongsToRef = db
            .collection("belongsTo")
            .where("userUid", "==", userUid)
            .where("groupId", "==", groupId);
          const belongsToSnapshot = await belongsToRef.get();
          // console.log(belongsToSnapshot.size);
          if (!belongsToSnapshot.empty) {
            const userDocs = belongsToSnapshot.docs[0];
            const userRef = userDocs.ref;
            const result = await userRef.update({ schedule: schedule });
            return res
              .status(200)
              .json({ message: "Succesfully updated user's schedule" });
          } else {
            console.log("Group or user does not exist");
            return res.status(500).json({ message: "Group or user not found" });
          }
        } catch (error) {
          console.log("Error @UserController/changeSchedule: ", error.message);
          return res.status(500).json({ message: error.message });
        }
      },

      getSchedule: async (req, res) => {
        const uid = req.params.uid;
        const groupId = req.params.groupId;
        try {
          const belongsToRef = db
            .collection("belongsTo")
            .where("userUid", "==", uid)
            .where("groupId", "==", groupId);
          const belongsToSnapshot = await belongsToRef.get();
          // console.log(belongsToSnapshot.size);
          if (!belongsToSnapshot.empty) {
            const userDocs = belongsToSnapshot.docs[0];
            const schedule = userDocs.data().schedule;
            return res.status(200).json({ schedule });
          } else {
            console.log("Group or user does not exist");
            return res.status(500).json({ message: "Group or user not found" });
          }
        } catch (error) {
          console.log("Error @UserController/getSchedule: ", error.message);
          return res.status(500).json({ message: error.message });
        }
      },

      getGroups: async (req, res) => {
        const userUid = req.params.uid;
        try {
          const belongsToRef = db
            .collection("belongsTo")
            .where("userUid", "==", userUid);
          const belongsToSnapshot = await belongsToRef.get();

          const groupIds = [];
          if (!belongsToSnapshot.empty) {
            belongsToSnapshot.forEach((belongsTo) => {
              const groupId = belongsTo.data().groupId;
              groupIds.push(groupId);
            });
          }

          const groups = [];
          for (const groupId of groupIds) {
            const groupRef = db.collection("groups").doc(groupId);
            const groupSnapshot = await groupRef.get();
            if (groupSnapshot.exists) {
              groups.push({
                groupId: groupSnapshot.id,
                name: groupSnapshot.data().name,
                creationDate: groupSnapshot.data().creationDate,
                groupPhotoUrl: groupSnapshot.data().groupPhotoUrl,
                owner: groupSnapshot.data().owner,
              });
            } else {
              console.log("Warning @UserController/getGroups: Group not found");
            }
          }

          res.status(200).json({ groups: groups });
        } catch (error) {
          console.log("Error @UserController/getGroups: ", error.message);
          return res.status(500).json({ message: error.message });
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

module.exports = UserController;

/*
  -> Get -> id se afla in req.params.uid  
  -> Post -> req.body
  -> Update -> id in params si datele de update req.body
  -> Delete -> id
  */

/* 
  UserController
  
  # User
  - getUser   # get
  - updateLocation 
  
  # Friendships
  - getAllFriendships 
  - addFriendship 
  - deleteFriendship

  # FriendRequests
  - sendFriendRequest #post
  - getAllFriendRequests #get
  - acceptFriendRequest #delete + post in frienships
  - rejectFriendRequest #delete

  #BelongsTo
  - post (atunci cand un user intra intr-un grup)
  - changeSchedule #update (cand userul updateaza programul pt grupul respectiv)
  - get (unui user trebuie sa ii afisam toate grupurile)

*/
