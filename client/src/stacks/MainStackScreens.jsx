import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Home from "../screens/home/home.component";
import Contacts from "../screens/contacts/contacts.component"
import GroupStackScreens from "./GroupStackScreens";

const MainStackScreens = () => {
  const Tab = createBottomTabNavigator();
  const getTabBarVisibility = (route) => {
    const routeName = route.state 
      ? route.state.routes[route.state.index].name: ''

    if(routeName == 'Chat') {
      return false
    }
    return true
  }
  return (
    <Tab.Navigator 
      tabBarOptions={{
        keyboardHidesTabBar: true
      }}
    >    
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen 
        name="Groups" 
        component={GroupStackScreens} 
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route)
        })}
      />
      
    </Tab.Navigator>
  );
};

export default MainStackScreens;
