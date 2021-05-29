import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar/FocusAwareStatusBar.component";

import Home from "../screens/home/home.component";
import GroupStackScreens from "./GroupStackScreens";
import FriendsStackScreens from "./FriendsStackScreens";
import ProfileStackScreens from "./ProfileStackScreens";

const MainStackScreens = () => {
  const Tab = createBottomTabNavigator();

  const getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : "";

    if (routeName == "Chat") {
      return false;
    }
    return true;
  };

  return (
    <>
      <FocusAwareStatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={Platform.OS === "android" ? "#000" : ""}
      />
      <Tab.Navigator
        tabBarOptions={{
          keyboardHidesTabBar: true,
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home")
              return <Entypo name="home" size={size} color={color} />;
            if (route.name === "Groups")
              return <FontAwesome name="group" size={size} color={color} />;
            if (route.name === "Friends")
              return (
                <FontAwesome5 name="user-friends" size={size} color={color} />
              );
            if (route.name === "Profile")
              return <FontAwesome name="user" size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />

        <Tab.Screen
          name="Groups"
          component={GroupStackScreens}
          options={({ route }) => ({
            tabBarVisible: getTabBarVisibility(route),
          })}
        />

        <Tab.Screen
          name="Friends"
          component={FriendsStackScreens}
          options={({ route }) => ({
            tabBarVisible: getTabBarVisibility(route),
          })}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStackScreens}
          options={({ route }) => ({
            tabBarVisible: getTabBarVisibility(route),
          })}
        />
      </Tab.Navigator>
    </>
  );
};

export default MainStackScreens;
