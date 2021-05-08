import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { StyleSheet, View, Text, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import React, {useState, useEffect, useContext} from 'react'
import * as Location from 'expo-location'

import {UserContext} from '../../context/UserContext'

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   
   justifyContent: 'center',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
 marker: {
  borderColor: 'red',
  borderRadius: 0
 }
});

export default () => {

  const [user, _] = useContext(UserContext)

  const [location, setLocation] = useState({
    coords: {
      latitude: 40,
      longitude: 40
    }
  });
  const [errorMsg, setErrorMsg] = useState(null);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
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
              coordinate={{
                  latitude: location?.coords.latitude,
                  longitude: location?.coords.longitude,
              }}
              title='ssss'
              description={JSON.stringify(location)}
              //image={{uri: user.profilePhotoUrl}}
              

          >
            <Text>sasy</Text>
            <Image
              source={{uri: user.profilePictureUrl}}
            />
            <Icon
              name='sc-telegram'
              type='evilicon'
              color='#517fa4'
            />
          </Marker>
      </MapView>
    </View>
  )
}

