import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import Schedule from "../screens/schedule/schedule.component";
import Map from "../screens/map/map.component";

const MeetingStackScreens = ({ navigation }) => {
  const MeetingStack = createMaterialTopTabNavigator();

  return (
    <MeetingStack.Navigator headerMode="float">
      <MeetingStack.Screen name="Schedule" component={Schedule} />
      <MeetingStack.Screen name="Map" component={Map} />
    </MeetingStack.Navigator>
  );
};

export default MeetingStackScreens;
