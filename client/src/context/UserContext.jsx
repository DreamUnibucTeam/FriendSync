import React, { useEffect, useState, createContext } from "react";
import { setIntervalAsync } from "set-interval-async/dynamic";
import { clearIntervalAsync } from "set-interval-async";
import { useHttp } from "../hooks/http.hook";
import * as Location from "expo-location";
import { auth } from "../firebase/firebase";
import { Alert } from "react-native";
const UserContext = createContext([{}, () => {}]);

const UserProvider = (props) => {
  const { request, REST_API_LINK } = useHttp();
  const [userLocation, setUserLocation] = useState({});

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Warning", "Permission to access location was denied");
        return [status, null];
      }

      let currLocation = await Location.getCurrentPositionAsync({});
      return [status, currLocation.coords];
    } catch (error) {
      console.log("Error @UserContext/getCurrentLocation", error.message);
    }
  };

  const updateBackgroundUserLocation = async () => {
    try {
      if (!auth.currentUser) return;
      const token = await auth.currentUser?.getIdToken();
      const uid = auth.currentUser?.uid;
      const [_, location] = await getCurrentLocation();
      if (location === null || !auth.currentUser || !uid || !token) return;

      setUserLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      const response = await request(
        `${REST_API_LINK}/api/users/user/location/${uid}`,
        "PUT",
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      // console.log(response.message);
    } catch (error) {
      console.log("Error @UserContext/setLocation", error.message);
    }
  };

  useEffect(() => {
    let unsubscribeFromInterval = null;
    if (auth.currentUser) {
      updateBackgroundUserLocation();
      unsubscribeFromInterval = setIntervalAsync(
        updateBackgroundUserLocation,
        5000
      );
    }
    return () =>
      unsubscribeFromInterval && clearIntervalAsync(unsubscribeFromInterval);
  }, [auth.currentUser]);

  const [state, setState] = useState({
    uid: "",
    displayName: "",
    email: "",
    isLoggedIn: false,
    profilePhotoUrl: "default",
  });

  return (
    <UserContext.Provider value={[state, setState]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
