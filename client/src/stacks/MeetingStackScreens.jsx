import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useContext } from "react";

import Schedule from "../screens/schedule/schedule.component";
import ChooseMeetingLocationMap from "../screens/choose-meeting-location-map/map.component";
import SeeFriendsLocationMap from '../screens/see-friends-location-map/map.component'
import {GroupContext} from "../context/GroupContext"

const MeetingStackScreens = ({ navigation }) => {
  const MeetingStack = createMaterialTopTabNavigator();
  const [group, setGroup] = useContext(GroupContext)

  return (
    <MeetingStack.Navigator headerMode="float">
      <MeetingStack.Screen name="Schedule" component={Schedule} />
      <MeetingStack.Screen 
        name="Map" 
        component={ChooseMeetingLocationMap} 
      />
      {
        group.meeting?.location ? 
          <MeetingStack.Screen 
            name="Map2" 
            component={SeeFriendsLocationMap} 
          />
        :
          <></>
      }
    </MeetingStack.Navigator>
  );
};

export default MeetingStackScreens;
