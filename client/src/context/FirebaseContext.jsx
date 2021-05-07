import React, { useState, createContext } from "react";
import firebase, { auth, db, storage } from "../firebase/firebase";

const FirebaseContext = createContext();

const Firebase = {
  getCurrentUser: () => auth.currentUser,
  getCurrentUserId: () => auth.currentUser.uid,
  getCurrentUserToken: () => auth.currentUser.getIdToken(),
  getUserRef: (user) => db.collection("users").doc(user.uid),
  createUserProfile: async (userData) => {
    if (!userData) return;

    const userRef = db.collection("users").doc(userData.uid);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
      const { displayName, email, profilePhoto } = userData;
      const creationDate = new Date();

      const profilePhotoUrl = await Firebase.uploadProfilePhoto(profilePhoto);

      try {
        await userRef.set({
          displayName,
          email,
          profilePhotoUrl,
          creationDate,
        });
      } catch (error) {
        console.log(
          "Error @Firebase.createUserProfile while creating the user profile: ",
          error.message
        );
      }
    }

    return userRef;
  },
  uploadProfilePhoto: async (uri) => {
    if (uri === "default")
      return "https://firebasestorage.googleapis.com/v0/b/friendsync-5fc52.appspot.com/o/profilePhotos%2Fdefault.jpg?alt=media&token=79259943-c556-409f-a072-205422420cf0";
    const uid = Firebase.getCurrentUserId();

    try {
      const photo = await Firebase.getBlob(uri);

      const imageRef = storage.ref().child(`profilePhotos/${uid}$`);
      await imageRef.put(photo);

      const url = await imageRef.getDownloadURL();
      return url;
    } catch (error) {
      console.log(
        "Error @Firebase.uploadProfilePhoto while uploading profile photo: ",
        error.message
      );
    }
  },
  getBlob: async (uri) => {
    // Source: https://github.com/expo/expo/issues/2402
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Error @getBlob: Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  },
};

const FirebaseProvider = (props) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
