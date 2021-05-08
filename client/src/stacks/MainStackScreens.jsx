import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "../screens/home/home.component";
import Contacts from "../screens/contacts/contacts.component";
import Groups from "../screens/groups/groups.component";
import MapTest from "../screens/maptest/mapTest.component"

const MainStackScreens = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Groups" component={Groups} />
      <Tab.Screen name="Map test" component={MapTest} />
      
    </Tab.Navigator>
  );
};

export default MainStackScreens;
