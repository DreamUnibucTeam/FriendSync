import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Messages from '../screens/messages/messages.component'
import Map from '../screens/map/map.component'

const GroupStackScreens = () => {
  const GroupStack = createStackNavigator();

  return (
    <GroupStack.Navigator headerMode="none">
      <GroupStack.Screen name="Messages" component={Messages} />
      <GroupStack.Screen name="Map" component={Map} />
    </GroupStack.Navigator>
  );
};

export default GroupStackScreens;
