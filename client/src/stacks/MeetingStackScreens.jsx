import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useContext } from "react";
import moment from "moment"

import Schedule from "../screens/schedule/schedule.component";
import ChooseMeetingLocationMap from "../screens/choose-meeting-location-map/map.component";
import SeeFriendsLocationMap from '../screens/see-friends-location-map/map.component'
import {GroupContext} from "../context/GroupContext"

const MeetingStackScreens = ({ navigation }) => {
  const MeetingStack = createMaterialTopTabNavigator();
  const [group, setGroup] = useContext(GroupContext)

  return ((group.meeting?.time && moment().valueOf() <= group.meeting?.time[1]) ?
  (
    <MeetingStack.Navigator headerMode="float">
      <MeetingStack.Screen name="Schedule" component={Schedule} />

      {
        group.meeting?.location && group.meeting?.time && moment().valueOf() >= moment(group.meeting.time[0]).subtract({ hours: 6 }).valueOf() ? 
          <MeetingStack.Screen 
            name="See Friends" 
            component={SeeFriendsLocationMap} 
          />
        :
        <MeetingStack.Screen 
          name="Choose Location" 
          component={ChooseMeetingLocationMap} 
        />
      }
    </MeetingStack.Navigator>
  )
  :
  (
    <Schedule></Schedule>
  ))
};

export default MeetingStackScreens;
