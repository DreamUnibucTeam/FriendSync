import 'react-native-gesture-handler'
import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'

import AppStackScreens from './src/stacks/AppStackScreens'
import {UserProvider} from './src/context/UserContext'
//import {FirebaseProvider} from './src/context/FirebaseContext'


const App = () => {
  const Stack = createStackNavigator()
  return (
   // <FirebaseProvider>
    <UserProvider>
      <NavigationContainer>
        <AppStackScreens />
      </NavigationContainer>
    </UserProvider>

  //  </FirebaseProvider>
    
    
    
  );
}

export default App;

