const {auth, db} = require('../firebase/firebase.admin.js')

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
          const id = req.params.id
          const groupSnapshot = db.collection('groups').doc(id)
          if (groupSnapshot.exists) {
            return res.status(200).json({ group: {id, ...groupSnapshot.data()} })
          }
          return res.status(500).json({ message: "The groups does not exist or has been deleted" })
        } catch (error) {
          console.log("Error @GroupController/getGroup: ", error.message)
          return res.status(500).json({ message: error.message })  
        }
      },

      createGroup: async (req, res) => {
        try {
          const { uid, name } = req.body
          const creationDate = (new Date()).toString()
          const result = await db.collection('groups').add({ name, owner: uid, creationDate })
          const groupId = result.id
          const makeAdminResult = await db.collection('belongsTo').add({ userId: uid, groupId, isAdmin: True, schedule: null })
          res.status(200).json({ message: 'Group has been created successfully'})
        } catch (error) {
          console.log("Error @GroupController/createGroup: ", error.message)
          return res.status(500).json({ message: error.message })  
        }
      },

      removeGroup: async (req, res) => {
        try {
          const id = req.params.id
          const { uid } = req.body
          // const uid = req.user.uid

          const groupRef = db.collection('groups').doc(id)
          const groupSnapshot = await groupRef.get()
          if (!groupSnapshot.exists) {
            return res.status(500).json({ message: "Group has been deleted or does not exist" })
          }
          if (groupSnapshot.data().owner != uid) {
            return res.status(500).json({ message: "You are not the group's admin to delete it" })
          }
          const result = await groupRef.delete()
          
          // Stergem toate belongs to din tabel
          const belongsToSnapshot = await db.collection('belongsTo').where('groupId', '==', groupId).get()
          if (belongsToSnapshot.exists) {
            belongsToSnapshot.forEach(async (doc) => {
              await doc.ref.delete()
              // TODO: check again
            })
          }
          res.status(200).json({ message: "The group has been successfully deleted" })
        } catch (error) {
          console.log("Error @GroupController/removeGroup: ", error.message)
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


module.exports = GroupController

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