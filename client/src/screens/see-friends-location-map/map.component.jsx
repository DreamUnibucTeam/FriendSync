import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import { StyleSheet, View, Text, Image } from "react-native";
import { Icon } from "react-native-elements";
import React, { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import styled from "styled-components";

import { UserContext } from "../../context/UserContext";
import { GroupContext } from "../../context/GroupContext";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { setIntervalAsync } from "set-interval-async/dynamic";
import { clearIntervalAsync } from "set-interval-async";
import { FlatList } from "react-native";

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
  const { request, loading, REST_API_LINK } = useHttp();
  const [user, _] = useContext(UserContext);
  const [group, setGroup] = useContext(GroupContext);
  const [usersLocations, setUsersLocations] = useState([]);
  const [myLocation, setMyLocation] = useState({ latitude: 47, longitude: 29 });
  const [region, setRegion] = useState({
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
    latitude: 47,
    longitude: 29
  })

  const [location, setLocation] = useState({
    coords: {
      latitude: 47.098,
      longitude: 28.8247,
    },
  });
  const [errorMsg, setErrorMsg] = useState(null);


  useEffect(() => {
    setRegion({...region, latitude: group.meeting.location.latitude, longitude: group.meeting.location?.longitude})
  }, [])

  useEffect(() => {
    let unsubscribeFromInterval = null;
    if (auth.currentUser) {
      unsubscribeFromInterval = setIntervalAsync(getUsersLocations, 5000);
    }

    return () =>
      unsubscribeFromInterval && clearInterval(unsubscribeFromInterval);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let currLocation = await Location.getCurrentPositionAsync({});
        setLocation(currLocation);
      } catch (error) {
        console.log("Error @SeeFriendsMap/getLocation: ", error.message);
      }
    })();
  }, []);

  const getUsersLocations = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const uid = auth.currentUser?.uid;
      if (!auth.currentUser || !uid || !token) return;

      const response = await request(
        `${REST_API_LINK}/api/users/locations`,
        "GET",
        null,
        {
          Auhtorization: `Bearer ${token}`,
        }
      );

      const myCurrentLocation = response.usersLocations.filter(
        (usloc) => usloc.userUid === uid
      )[0];
      //console.log(myCurrentLocation?myCurrentLocation:null)
      setUsersLocations(response.usersLocations);
     // setMyLocation(myCurrentLocation?myCurrentLocation:null);
      setRegion({...region, latitude: myLocation.latitude, longitude: myLocation.longitude})
      //console.log("Users: ", response.usersLocations);
      //console.log("Mine: ", myCurrentLocation);
    } catch (error) {
      console.log("Error @SeeFriendsMap/getUsersLocations: ", error.message);
    }
  };
  const markerUrl =
    "https://firebasestorage.googleapis.com/v0/b/friendsync-5fc52.appspot.com/o/assets%2FchooseLocationMarker.png?alt=media&token=c73f8a3e-4002-4951-816f-c1dc0f71f08b";


  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={reg => setRegion(reg)}
      >
        {(group.meeting)?
        (<Marker
          title={group.meeting.location?.name}
          description="5 km"
          coordinate={{
            latitude: group.meeting.location?.latitude,
            longitude: group.meeting.location?.longitude,
          }}
        >
          <View style={{flex:1}}>
            <Image 
              source={{ uri: markerUrl }} 
              style={{width: 40, height: 40}}
              resizeMode="center"
              resizeMethod="resize"
            />
          </View>
        </Marker>)
        :
        null
        }
        {usersLocations.map(item => (
          <Marker
            title={item.name}
            description="5 km"
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            key={item.userUid}
            style={{flex:1, justifyContent:'center', alignItems:'center'}}
          >

            <Text 
              style={{backgroundColor:'white', borderRadius:5, paddingLeft:5, paddingRight: 5}}
            >
              {item.name}
            </Text>
            <ImageMarkerWrapper source={{ uri: item.profilePhotoUrl }} />
          </Marker>
        ))}
        
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


const ImageMainMarkerWrapper = styled.Image`
  width: 160px;
  height: 160px;
  position: absolute;
`;


const ImageMarkerWrapper = styled.Image`

border-color: gray; 
border-width: 2px;
border-radius: 50px; 
height: 50px;
width: 50px;
`;
