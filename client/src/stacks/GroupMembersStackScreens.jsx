import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";

import { Alert, Button } from "react-native";
import { GroupContext } from "../context/GroupContext";
import { auth } from "../firebase/firebase";
import { useHttp } from "../hooks/http.hook";

import GroupSettings from "../screens/group-settings/group-settings.component";
import AddGroupMember from "../screens/add-group-member/add-group-member.component";

const GroupMembersStackScreens = ({ navigation }) => {
  const GroupMembersStack = createStackNavigator();
  const [group, setGroup] = useContext(GroupContext);
  const { request, loading, error, REST_API_LINK } = useHttp();

  const addMember = () => {
    const uid = auth.currentUser.uid;
    if (group.owner !== uid)
      return Alert.alert(
        "Not enough permissions",
        "You are not the admin of the group to add members to group"
      );
    navigation.navigate("AddMember");
  };

  const removeGroupAPI = async () => {
    try {
      const uid = auth.currentUser.uid;
      const groupId = group.id;
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/groups/group/${groupId}`,
        "DELETE",
        { uid },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      Alert.alert("Succes", response.message);
      navigation.navigate("GroupList");
    } catch (error) {
      console.log(
        "Error @GroupMembersStackScreens/removeGroupAPI: ",
        error.message
      );
      Alert.alert("Error", error.message);
    }
  };

  const removeGroup = () => {
    const uid = auth.currentUser.uid;
    if (group.owner !== uid)
      return Alert.alert(
        "Not enough permissions",
        "You are not the admin of the group to add members to group"
      );
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete the group? Everything related to it will be deleted",
      [
        {
          text: "Delete",
          onPress: () => removeGroupAPI(),
          style: "destructive",
        },
        {
          text: "Cancel",
          onPress: () => console.log("Canceled"),
          style: "cancel",
        },
      ]
    );
  };

  return (
    <GroupMembersStack.Navigator headerMode="float">
      <GroupMembersStack.Screen
        name="Members"
        component={GroupSettings}
        options={{
          headerBackTitleVisible: false,
          headerLeft: () => (
            <Button
              onPress={addMember}
              type="clear"
              title="Add Member"
              style={{ marginLeft: 5 }}
            />
          ),
          headerTitle: null,
          headerRight: () => (
            <Button
              onPress={removeGroup}
              type="clear"
              color="red"
              title="Delete Group"
              style={{ marginRight: 5 }}
            />
          ),
        }}
      />
      <GroupMembersStack.Screen
        name="AddMember"
        component={AddGroupMember}
        options={{
          title: "Add Group Members",
          headerBackTitleVisible: false,
        }}
      />
    </GroupMembersStack.Navigator>
  );
};

export default GroupMembersStackScreens;
