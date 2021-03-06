const { auth, db } = require("../firebase/firebase.admin.js");

const GroupController = (() => {
  /* Intanta care salveaza referinta controller-ului */
  let instance = null;

  const init = () => {
    /* Private functions */

    /* Public functions */
    return {
      /* Groups */
      getGroup: async (req, res) => {
        try {
          const id = req.params.id;
          const groupSnapshot = await db.collection("groups").doc(id).get();
          if (groupSnapshot.exists) {
            return res.status(200).json({
              group: {
                id,
                ...groupSnapshot.data(),
                // groupPhotoUrl:
                //   "https://firebasestorage.googleapis.com/v0/b/friendsync-5fc52.appspot.com/o/groupPhotos%2Fdefault.png?alt=media&token=33f6237b-950e-425e-969c-3bc5de8dd1b2",
              },
            });
          }
          return res
            .status(500)
            .json({ message: "The groups does not exist or has been deleted" });
        } catch (error) {
          console.log("Error @GroupController/getGroup: ", error.message);
          return res.status(500).json({ message: error.message });
        }
      },

      createGroup: async (req, res) => {
        try {
          const { uid, name, groupPhotoUrl } = req.body;
          const creationDate = new Date().toString();
          const result = await db
            .collection("groups")
            .add({ name, owner: uid, creationDate, groupPhotoUrl });
          const groupId = result.id;
          const makeAdminResult = await db
            .collection("belongsTo")
            .add({ userUid: uid, groupId, isAdmin: true, schedule: [] });
          res
            .status(200)
            .json({ message: "Group has been created successfully" });
        } catch (error) {
          console.log("Error @GroupController/createGroup: ", error.message);
          return res.status(500).json({ message: error.message });
        }
      },

      removeGroup: async (req, res) => {
        try {
          const groupId = req.params.id;
          const { uid } = req.body;
          // const uid = req.user.uid

          const groupRef = db.collection("groups").doc(groupId);
          const groupSnapshot = await groupRef.get();
          if (!groupSnapshot.exists) {
            return res
              .status(500)
              .json({ message: "Group has been deleted or does not exist" });
          }
          if (groupSnapshot.data().owner !== uid) {
            return res.status(500).json({
              message: "You don't have enough permissions to delete the group",
            });
          }
          const result = await groupRef.delete();

          // Stergem toate belongs to din tabel
          const belongsToQuery = await db
            .collection("belongsTo")
            .where("groupId", "==", groupId)
            .get();

          const belongsIds = [];
          if (!belongsToQuery.empty) {
            belongsToQuery.forEach((doc) => {
              belongsIds.push(doc.id);
            });
          }

          for (const bid of belongsIds) {
            await db.collection("belongsTo").doc(bid).delete();
          }

          res
            .status(200)
            .json({ message: "The group has been successfully deleted" });
        } catch (error) {
          console.log("Error @GroupController/removeGroup: ", error.message);
          return res.status(500).json({ message: error.message });
        }
      },

      getAllMembers: async (req, res) => {
        try {
          const id = req.params.id;

          const membersQuery = await db
            .collection("belongsTo")
            .where("groupId", "==", id)
            .get();
          const membersIds = [];
          if (!membersQuery.empty) {
            membersQuery.forEach((member) => {
              membersIds.push(member.data().userUid);
            });
          }

          const members = [];
          for (const userId of membersIds) {
            const userSnapshot = await db.collection("users").doc(userId).get();
            if (userSnapshot.exists) {
              members.push({
                uid: userId,
                displayName: userSnapshot.data().displayName,
                profilePhotoUrl: userSnapshot.data().profilePhotoUrl,
              });
            }
          }

          return res.status(200).json({ members });
        } catch (error) {
          console.log("Error @GroupController/getAllMembers: ", error.message);
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

module.exports = GroupController;

/*
    User Controller

    # Groups
    -getGroup #get
    -getAll ? Nu prea are sens, oricum vor fi adaugati toti cu invite-uri
    -createGroup #post
    -update ?? Nu stiu ce update sa fac, nu conteaza oricum
    -delete #delete (ar trebui sa sterg toti membrii asa)

    # User interaction
    - addUser (done in user controller)
    - si remove user???
*/
