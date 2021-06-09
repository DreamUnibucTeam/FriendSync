import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import { StyleSheet, View, Text, Image } from "react-native";
import { Icon } from "react-native-elements";
import React, { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import styled from "styled-components";

import { UserContext } from "../../context/UserContext";
import { GroupContext } from "../../context/GroupContext";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    borderColor: "red",
    borderRadius: 0,
  },
});

const Map = () => {
  const [user, _] = useContext(UserContext);

  const [location, setLocation] = useState({
    coords: {
      latitude: 47.098,
      longitude: 28.8247,
    },
  });
  const [errorMsg, setErrorMsg] = useState(null);

  const [group, setGroup] = useContext(GroupContext);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currLocation = await Location.getCurrentPositionAsync({});
      setLocation(currLocation);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker
          title={user.displayName}
          description="5 km"
          coordinate={{
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
          }}
        >
          <Text>{user.displayName}</Text>
          <ImageMarkerWrapper source={{ uri: user.profilePhotoUrl }} />
        </Marker>
      </MapView>
    </View>
  );
};

export default Map;

{
  /* <Icon
  name='sc-telegram'
  type='evilicon'
  color='#517fa4'
  /> */
}

const ImageMarkerWrapper = styled.Image`
  flex: 1;
  border: solid 2px gray;
  border-width: 1px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  height: 75px;
  width: 75px;
`;