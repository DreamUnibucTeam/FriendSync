import React, { useState, createContext } from "react";
import firebase, { auth, db, storage } from "../firebase/firebase";

const FirebaseContext = createContext();

const Firebase = {
  getCurrentUser: () => auth.currentUser,
  getCurrentUserId: () => auth.currentUser.uid,
  createUserProfile: async (userData) => {
    if (!userData) return;

    const userRef = db.collection("users").doc(userData.uid);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
      const { displayName, email, profilePhoto } = userData;
      const creationDate = new Date();

      const profilePhotoUrl;
      if (userData.profilePhoto)
        profilePhotoUrl = await Firebase.uploadProfilePhoto(profilePhoto);

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
    const uid = Firebase.getCurrentUserId();

    try {
      const photo = await Firebase.getBlob(uri);

      const imageRef = firebase.storage.ref("profilePhotos").child(uid);
      await imageRef.put(photo);

      const url = await imageRef.getDownloadURL();

      await db.collection("users").doc(uid).update({
        profilePhotoUrl: url,
      });

      return url;
    } catch (error) {
      console.log(
        "Error @Firebase.uploadProfilePhoto while uploading profile photo: ",
        error.message
      );
    }
  },
  getBlob: async (uri) => {
    const data = await fetch(uri);
    data = await data.blob();
    return data;
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
