import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import { StyleSheet, View, Text, Image, Button } from "react-native";
import { Icon } from "react-native-elements";
import React, { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import styled from "styled-components";

import { useHttp } from "../../hooks/http.hook";
import { UserContext } from "../../context/UserContext";
import { PropsService } from "@ui-kitten/components/devsupport";
import CustomText from "../../components/customText/customText.component";

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

const Map = ({ navigation }) => {
  const [user, _] = useContext(UserContext);
  const { request, error, loading, REST_API_LINK } = useHttp();

  const [locationInfo, setLocationInfo] = useState({
    type: "blea",
    name: "nlea",
    road: "roaddd",
    houseNumber: "",
  });
  const [errorMsg, setErrorMsg] = useState(null);

  const [region, setRegion] = useState({
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
    latitude: 47.098,
    longitude: 28.8247,
  });

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

  const markerUrl =
    "https://firebasestorage.googleapis.com/v0/b/friendsync-5fc52.appspot.com/o/assets%2FchooseLocationMarker.png?alt=media&token=c73f8a3e-4002-4951-816f-c1dc0f71f08b";

  const getGoogleLocationAddress = async () => {
    try {
      const geoLink = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=AIzaSyCT-UD_TzioTpxo5hJ9uhASQhkLq6vqZA4`;
      const data = await request(geoLink);

      const placeId = data.results[0].place_id;
      const placeLink = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCT-UD_TzioTpxo5hJ9uhASQhkLq6vqZA4`;

      console.log(placeId);
      const placeData = await request(placeLink);
      const result = placeData.result;

      console.log(result.formatted_address, result.name);
    } catch (error) {
      console.log("Error @Map/getLocationAddress: ", error.message);
    }
  };

  const getLocationAddress = async () => {
    try {
      const geoLink = `https://api.opencagedata.com/geocode/v1/json?q=${region.latitude}%2C%20${region.longitude}&key=007c45636d1d4023ae4daabd42e15dec&language=en&pretty=1`;

      const data = await request(geoLink);
      const components = data.results[0].components;
      const type = components["_type"];
      const name = components[type];
      const road = components["road"];
      const houseNumber = components["house_number"];
      console.log(type, name, road);
      setLocationInfo({
        type: type,
        name: name,
        road: road,
        houseNumber: houseNumber,
      });

      console.log(components);
    } catch (error) {
      console.log("Error @Map/getLocationAddress: ", error.message);
    }
  };

  return (
    <View style={{ height: "100%", flex: 1 }}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={async (reg) => {
            setRegion(reg);
            await getLocationAddress();
          }}
        >
          {/* <Marker
            title={user.displayName}
            description="5 km"
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
          >
            <Text>{user.displayName}</Text>
            <ImageMarkerWrapper source={{ uri: user.profilePhotoUrl }} />
          </Marker> */}
        </MapView>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ImageMarkerWrapper source={{ uri: markerUrl }} />
        </View>
      </View>
      <View
        style={{
          backgroundColor: "white",
          margin: 10,
          padding: 10,
          height: 50,
          borderRadius: 10,
        }}
      >
        <View>
          <CustomText center medium>
            {(locationInfo.type == "building" ||
            locationInfo.type == "road" ||
            locationInfo.type === undefined
              ? ""
              : locationInfo.name + ", ") +
              locationInfo.road +
              " " +
              (locationInfo.houseNumber !== undefined
                ? locationInfo.houseNumber
                : "")}
          </CustomText>
        </View>
      </View>
      <View
        style={{
          alignSelf: "flex-end",
          position: "absolute",
          bottom: "5%",
          right: "5%",
        }}
      >
        <Button
          style={{ position: "absolute", left: 0, bottom: 0, right: 0 }}
          title="Choose"
        ></Button>
      </View>
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
  /* border: solid 2px gray; */
  /* border-width: 1px; */
  /* border-radius: 50px; */
  align-items: center;
  justify-content: center;
  height: 75px;
  width: 75px;
`;

const ChooseLocationButton = styled.Button``;
