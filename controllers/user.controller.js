const {auth, db} = require('../firebase/firebase.admin.js')

const UserController = (() => {
  /* Intanta care salveaza referinta controller-ului */
  let instance = null;

  const init = () => {
    /* Private functions */

    /* Public functions */
    return {
      /* Users */
      getUser: async (uid) => {
        try {
          const userSnapshot = await db.collection('users').doc(uid).get()
        } catch (error) {
          return console.log("Error @UserController/getUser: ", error.message)
        }

        if (userSnapshot.exists) {
          return { uid: userSnapshot.uid, ...userSnapshot.data() }
        } 

        throw new Error("Error @UserController/getUser: User does not exist or has been deleted")
      },

      updateLocation: async (req, res) => {
        const uid = req.params.id;
        const coordonate = req.body;

        try {
            const userRef = db.collection('users').doc(uid);
            const response = await userRef.update({location: coordonate});
            if (response.status == 200) {
                return res.status(200).json({ message: "Succesfully updated user" })
            }
            return res.status(404).json({ message: "Unable to update user's location"});
        } catch(error){
            console.log("Error @UserController/updateLocation: ", error.message);
            return res.status(500).json({ message: "Unable to update user's location"});
        }
      },

      /* Friendships */
      getAllFriendships: async (req, res) => {
        try {
          const uid = req.params.uid
          const friendshipsRef = db.collection('friendships')
          const friendshipsSnapshot1 = await friendshipsRef.where('uid1', '==', uid).get();
          const friendshipsSnapshot2 = await friendshipsRef.where('uid2', '==', uid).get();
          const result = []
          if (friendshipsSnapshot1.exists){
            friendshipsSnapshot1.forEach(friendship => {
              const friendUid = friendship.data().uid2
              const friendData = getUser(friendUid)
              result.push({ friendshipId: friendship.id, uid: friendData.uid, name: friendData.name});
            })
          }
          if (friendshipsSnapshot2.exists){
            friendshipsSnapshot2.forEach(friendship => {
              const friendUid = friendship.data().uid1
              const friendData = getUser(friendUid)
              result.push({ friendshipId: friendship.id, uid: friendData.uid, name: friendData.name});
            })
          }

          res.status(200).json({ friendships: result });
        } catch (error) {
          console.log("Error @UserController/getFriendships: ", error.message)
          return res.status(500).json({ message: error.message })
        }
      },

      addFriendship: async (uid1, uid2) => {
        try {
          const startDate = (new Date()).toString()
          const response = await db.collection('friendships').add({ uid1: uid1, uid2: uid2, startDate })
          return response
        } catch (error) {
          return console.log("Error @UserController/addFriendship: ", error.message)          
        }
      },

      deleteFriendship: async (req, res) => {
        try {
          const id = req.params.id
          const response = await db.collection('friendships').doc(id).delete()
          res.status(200).json({ message: "Friend has been deleted successfully"})
        } catch (error) {
          console.log("Error @UserController/deleteFriendship: ", error.message)
          return res.status(500).json({ message: error.message })  
        }
      },

      /* Friend Requests */
      getAllFriendRequests: async (req, res) => {
        try {
          const uid = req.params.uid;
          const friendRequestsRef = db.collection('friendRequests')
          const friendRequestsSnapshot = await friendshipsRef.where('toUid', '==', uid).get();
          const result = []
          
          if (friendRequestsSnapshot.exists){
            friendRequestsSnapshot.forEach(friendRequest => {
              const userUid = friendRequest.data().fromUid
              const userData = getUser(friendUid)
              result.push({ friendRequestId: friendRequest.id, uid: userUid, name: userData.name});
            })
          }
          
          res.status(200).json({ friendRequests: result });
        } catch (error) {
          console.log("Error @UserController/getAllFriendRequests: ", error.message)
          return res.status(500).json({ message: error.message })  
        }
      },

      sendFriendRequest: async (req, res) => {
        try {
          const {fromUid, toUid} = req.body
          const sentDate = (new Date()).toString()
          const response = await db.collection('friendRequests').add({ fromUid, toUid, sentDate })
          res.status(200).json({ message: "Friend request has been successfully sent"})
        } catch (error) {
          console.log("Error @UserController/sendFriendRequest: ", error.message)
          return res.status(500).json({ message: error.message })  
        }
      },

      acceptFriendRequest: async (req, res) => {
        try {
          const id = req.params.id
          const { uid1, uid2 } = req.body
          const responseDel = await db.collection('friendRequests').doc(id).delete()
          const responseAdd = await addFriendship(uid1, uid2)
          if (responseAdd) res.status(200).json({ message: "New friendship has been made"})
          else res.status(500).json({ message: "Error occured at adding friendship" })
        } catch (error) {
          console.log("Error @UserController/acceptFriendRequest: ", error.message)
          return res.status(500).json({ message: error.message })  
        }
      },

      rejectFriendRequest: async (req, res) => {
        try {
          const id = req.params.id
          const response = await db.collection('friendRequests').doc(id).delete()
          res.status(200).json({ message: "Friend request has been rejected successfully"}) 
        } catch (error) {
          console.log("Error @UserController/rejectFriendRequest: ", error.message)
          return res.status(500).json({ message: error.message })  
        }
      },

      /* BelongsTo */
      addToGroup: async (req, res) =>{
          try {
              // const adminUid = req.user.uid
              const { adminUid, userUid, groupId } = req.body
              // Vericare in BelongsTo daca e admin  
              const belongsToSnapshot = await db.collection('belongsTo').where('userUid', '==', adminUid).where('groupId', '==', groupId).get()
              if (belongsToSnapshot.exists && belongsToSnapshot.data().isAdmin) {
                const result = await db.collection('belongsTo').add({ userUid, groupId, isAdmin: False, schedule: null})
                return res.status(200).json({message: 'User added to group.'})
              } else {
                return res.status(500).json({ message: "You are not the admin of the group" })
              }
          } catch (error) {
              console.log("Error @UserController/getInGroup: ", error.message)
              return res.status(500).json({ message: error.message })  
          }
      },

      changeSchedule: async (req, res) =>{
        const { userUid, groupId, schedule } = req.body
        try{
            const belongsToRef = db.collection('belongsTo').where('userUid', '==', userUid).where('groupId', '==', groupId)
            const belongsToSnapshot = await belongsToRef.get()
            if (belongsToSnapshot.exists) {
                const result = await belongsToRef.update({schedule: schedule});              
                return res.status(200).json({ message: "Succesfully updated user's schedule" })
            }
            else{
                console.log("Group or user does not exist")
                return res.status(500).json({ message: "Group or user not found" })  
            }
            
        }
        catch(error){
            console.log("Error @UserController/changeSchedule: ", error.message)
            return res.status(500).json({ message: error.message })  
        }
      },

      getGroups: async (req, res) => {
          const userUid = req.params.uid
          try{
            const belongsToRef = db.collection('belongsTo').where('userUid', '==', userUid)
            const belongsToSnapshot = await belongsToRef.get()
            groups = []
            if(belongsToSnapshot.exists){
                belongsToSnapshot.forEach(async (belongsTo) => {
                    const groupId = belongsTo.data().groupId;
                    const groupRef = db.collection('groups').where('groupId', '==',  groupId);
                    const groupSnapshot = await groupRef.get()
                    if(groupSnapshot.exists){
                        groups.push({ groupId: groupSnapshot.id, name: groupSnapshot.data().name, creationDate: groupSnapshot.data().creationDate});
                    } 
                    else{
                        console.log("Group not found inside loop.")
                    }
                })
                res.status(200).json({ groups: groups });
            }
            else{
                console.log("@UserController/getGroups: No groups found for this user")
                return res.status(200).json({ message: "User does not have any groups"}) 
            }
        }
        catch(error){
            console.log("Error @UserController/getGroups: ", error.message)
            return res.status(500).json({ message: error.message })  
        }
          
      }
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = init()
      return instance
    }
  }
})()

module.exports = UserController

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