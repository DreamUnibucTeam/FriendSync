import React, { useContext, useLayoutEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { UserContext } from "../context/UserContext";
import { FirebaseContext } from "../context/FirebaseContext";
import { auth } from "../firebase/firebase";

import AuthStackScreens from "./AuthStackScreens";
import MainStackScreens from "./MainStackScreens";

const AppStackScreens = () => {
  const Firebase = useContext(FirebaseContext);
  const [user, setUser] = useContext(UserContext);
  const AppStack = createStackNavigator();

  /* ComponentDidMount */
  useLayoutEffect(() => {
    let unsubscribeFromSnapshot = null;
    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        try {
          const userRef = await Firebase.getUserRef(userAuth);
          const snapShot = userRef.get();
          unsubscribeFromSnapshot = userRef.onSnapshot((snapShot) => {
            if (snapShot.exists) {
              setUser({
                uid: snapShot.id,
                email: snapShot.data().email,
                displayName: snapShot.data().displayName,
                profilePhotoUrl: snapShot.data().profilePhotoUrl,
                isLoggedIn: true,
              });
            }
          });
        } catch (error) {
          console.log("Error @onAuthStateChanged: ", error.message);
        }
      } else {
        setUser({
          uid: "",
          email: "",
          displayName: "",
          profilePhotoUrl: "default",
          isLoggedIn: false,
        });
      }
    });

    /* ComponentWillUnmount */
    return () => {
      unsubscribeFromSnapshot && unsubscribeFromSnapshot();
      unsubscribeFromAuth && unsubscribeFromAuth();
    };
  }, []);

  return (
    <AppStack.Navigator headerMode="none">
      {user.isLoggedIn ? (
        <AppStack.Screen name="Main" component={MainStackScreens} />
      ) : (
        <AppStack.Screen name="Auth" component={AuthStackScreens} />
      )}
    </AppStack.Navigator>
  );
};

export default AppStackScreens;
