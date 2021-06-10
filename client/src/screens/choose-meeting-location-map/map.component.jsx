import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import { StyleSheet, View, Text, Image, Button, Alert } from "react-native";
import { Icon } from "react-native-elements";
import React, { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import styled from "styled-components";

import { useHttp } from '../../hooks/http.hook'
import { useIsFocused } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import {GroupContext} from '../../context/GroupContext'
import { PropsService } from "@ui-kitten/components/devsupport";
import CustomText from '../../components/customText/customText.component'
import getLocationAddress from './geoLocator'
import {auth} from '../../firebase/firebase'

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    
  },
  infoContainer: {
    backgroundColor:'white', 
    margin:10, 
    padding:10, 
    height:50, 
    borderRadius:10
  },
  buttonConainer: {
    alignSelf:'flex-end',
    position:'absolute', 
    bottom: '5%', 
    right: '5%'
  },
  imageContainer: {
    position: 'absolute', 
    width:'100%', 
    height:'100%', 
    flex:1, 
    alignItems:'center', 
    justifyContent: 'center'
  }
});

const Map = ({navigation}) => {
  const [user, _] = useContext(UserContext);
  const [group, setGroup] = useContext(GroupContext)
  const {request, error, loading, REST_API_LINK} = useHttp()

  const [locationInfo, setLocationInfo] = useState({
    type: "blea", 
    name: "nlea",
    road: 'roaddd',
    houseNumber: ''
  });
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [region, setRegion] = useState({
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
    latitude: group.meeting && group.meeting.location ? group.meeting.location.latitude : 47.098,
    longitude: group.meeting && group.meeting.location ? group.meeting.location.longitude : 28.8247
  })
  const isFocused = useIsFocused()

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currLocation = await Location.getCurrentPositionAsync({});
      setRegion({...region, latitude: currLocation.latitude, longitude: currLocation.longitude});
    })();
  }, []);

  const markerUrl = 'https://firebasestorage.googleapis.com/v0/b/friendsync-5fc52.appspot.com/o/assets%2FchooseLocationMarker.png?alt=media&token=c73f8a3e-4002-4951-816f-c1dc0f71f08b'
  
  const setMeetingLocation = async () => {
    try {
       const location = {
        latitude: region.latitude,
        longitude: region.longitude,
        address: (locationInfo.road !== undefined ? locationInfo.road : "") + 
                 (locationInfo.houseNumber !== undefined ? " " + locationInfo.houseNumber : ""),
        name: (locationInfo.name !== undefined ? locationInfo.name : "")
      }
       const token = await auth.currentUser.getIdToken()
       const response = await request(`${REST_API_LINK}/api/meetings/meeting/location/${group.meeting.id}`, 'PUT', location, {
         Authorization: `Bearer ${token}`
       })
       
       setGroup({ ...group, meeting: {...group.meeting, location  }})
       Alert.alert("Success", response.message)
    } catch (error) {
      console.log("Error @MapSelector/setMeetingLocation", error.message)
      Alert.alert("Error", error.message)
    }
  }

  return (
    <View style={{height:'100%', flex:1}}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete = {async reg => {
            setRegion(reg)
            setLocationInfo(await getLocationAddress(request, reg))
          }}
        />
        <View style={styles.imageContainer}>
          <ImageMarkerWrapper source={{ uri: markerUrl }} />
          
        </View>
        
      </View>
      <View style={styles.infoContainer}>
        <View>
          <CustomText center medium>{
            ((locationInfo.type == 'building' || locationInfo.type == 'road' || locationInfo.type === undefined)? "":locationInfo.name + ', ') + 
            locationInfo.road + ' ' + 
            ((locationInfo.houseNumber !== undefined)? locationInfo.houseNumber:"")}
          </CustomText>
        </View>
        
      </View>
      <View style={styles.buttonConainer}>
        <Button
            status="info"
        
            style={{ position:'absolute', left: 0, bottom: 0, right: 0}}
            title="Choose"
            onPress = {
              async () => {
                await setMeetingLocation()
                navigation.navigate("Schedule")
              }
            }
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
width: 10%;
height: 10%;
`;

const ChooseLocationButton = styled.Button`
`