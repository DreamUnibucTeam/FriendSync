const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
