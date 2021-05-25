import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";

import { Alert, Button } from "react-native";
import { GroupContext } from "../context/GroupContext";
import { auth } from "../firebase/firebase";
import { useHttp } from "../hooks/http.hook";

import Meetings from "../screens/meetings/meetings.component";
import AddMeeting from "../screens/add-meeting/add-meeting.component";

const GroupMeetingsStackScreens = ({ navigation }) => {
  const GroupMeetingsStackScreens = createStackNavigator();

  return (
    <GroupMeetingsStackScreens.Navigator headerMode="none">
      <GroupMeetingsStackScreens.Screen
        name="GroupMeetings"
        component={Meetings}
      />
      <GroupMeetingsStackScreens.Screen
        name="AddMeeting"
        component={AddMeeting}
      />
    </GroupMeetingsStackScreens.Navigator>
  );
};

export default GroupMeetingsStackScreens;
