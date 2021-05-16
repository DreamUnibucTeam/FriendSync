import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Chat from "../screens/chat/chat.component";
import Map from "../screens/map/map.component";
import Groups from "../screens/groups/groups.component";

const ChatStackScreens = () => {
  const ChatStack = createMaterialTopTabNavigator();

  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="Chat" component={Chat} />
      <ChatStack.Screen name="Map" component={Map} />
    </ChatStack.Navigator>
  );
};

export default ChatStackScreens;
