import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Chat from "../screens/chat/chat.component";
import Map from "../screens/map/map.component";
import GroupMembersStackScreens from "./GroupMembersStackScreens";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar/FocusAwareStatusBar.component";

const ChatStackScreens = () => {
  const ChatStack = createMaterialTopTabNavigator();

  return (
    <>
      <FocusAwareStatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={Platform.OS === "android" ? "#000" : ""}
      />
      <ChatStack.Navigator>
        <ChatStack.Screen name="Chat" component={Chat} />
        <ChatStack.Screen name="Map" component={Map} />
        <ChatStack.Screen
          name="Settings"
          component={GroupMembersStackScreens}
        />
      </ChatStack.Navigator>
    </>
  );
};

export default ChatStackScreens;
