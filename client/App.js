import 'react-native-gesture-handler'
import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './src/screens/home/home.component'
import Contacts from './src/screens/contacts/contacts.component'
import Groups from './src/screens/groups/groups.component'
import SignInScreen from './src/screens/authScreens/signin/signInScreen.component'
import SignUpScreen from './src/screens/authScreens/signup/signUpScreen.component'

const Tab = createBottomTabNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Sign In"
          component={SignInScreen}
        />
        <Tab.Screen
          name="Sign Up"
          component={SignUpScreen}
        />
        <Tab.Screen
          name = "Home"
          component = {Home}
        />
        <Tab.Screen
          name = "Contacts"
          component = {Contacts}
        />
        <Tab.Screen
          name = "Groups"
          component = {Groups}
        />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}

export default App;

