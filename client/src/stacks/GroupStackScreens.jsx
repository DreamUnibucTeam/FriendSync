import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";

import AddGroup from "../screens/add-group/add-group.component";
import Chat from "../screens/chat/chat.component";
import Map from "../screens/map/map.component";
import Groups from "../screens/groups/groups.component";
import ChatStackScreens from "./ChatStack";
import { Button } from "react-native-elements";

import MeetingStackScreens from './MeetingStackScreens'

const GroupStackScreens = ({ navigation }) => {
  const GroupStack = createStackNavigator();

  return (
    <GroupStack.Navigator headerMode="float">
      <GroupStack.Screen
        name="GroupList"
        component={Groups}
        options={{
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("AddGroup")}
              icon={<AntDesign name="plus" size={24} color="#0066ff" />}
              type="clear"
            />
          ),
        }}
      />
      <GroupStack.Screen
        name="ChatStack"
        component={ChatStackScreens}
        options={({ route }) => ({
          title: route.params.params.groupName,
          headerBackTitleVisible: false,
        })}
      />
      <GroupStack.Screen
        name="AddGroup"
        component={AddGroup}
        options={({ route }) => ({
          title: "Create a new group",
          headerBackTitleVisible: false,
        })}
      />
      <GroupStack.Screen
        name="MeetingStack"
        component={MeetingStackScreens}
        options={({ route }) => ({
            title: route.params.meetingName,
            headerBackTitleVisible: false,
          })}
      />
      <GroupStack.Screen name="Map" component={Map} />
    </GroupStack.Navigator>
  );
};

export default GroupStackScreens;
