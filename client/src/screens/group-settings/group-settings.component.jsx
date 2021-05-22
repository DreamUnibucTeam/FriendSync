import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import styles from "./group-settings.styles";

import { FontAwesome } from "@expo/vector-icons";
import { ListItem, Button, Avatar, Divider } from "@ui-kitten/components";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import CustomText from "../../components/customText/customText.component";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { SearchBar } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { GroupContext } from "../../context/GroupContext";

const GroupSettings = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const [group, setGroup] = useContext(GroupContext);
  const { request, loading, error, REST_API_LINK } = useHttp();
  const isFocused = useIsFocused();

  const getGroupMembers = useCallback(async () => {
    try {
      const groupId = group.id;
      const token = await auth.currentUser.getIdToken();
      const response = await request(
        `${REST_API_LINK}/api/groups/group/${groupId}/members`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      setMembers(response.members);
      setFirstLoading(false);
    } catch (error) {
      console.log("Error @GroupSettings/getGroupMembers: ", error.message);
      Alert.alert("Error", error.message);
    }
  }, [group]);

  useEffect(() => {
    isFocused && getGroupMembers();
  }, [isFocused]);

  /* List items */
  const userProfilePhoto = (profilePhotoUrl) => (
    <Avatar source={{ uri: profilePhotoUrl }} />
  );

  const renderMemberItem = ({ item }) => (
    <ListItem
      title={`${item.displayName}`}
      description={item.uid === group.owner ? "Admin" : ""}
      accessoryLeft={() => userProfilePhoto(item.profilePhotoUrl)}
      //accessoryRight={() => userButton(item)}
      style={{ height: 80, paddingHorizontal: 30 }}
    />
  );

  return (
    <View style={styles.container}>
      {firstLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator style={styles.firstLoading} color="#000" />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.uid}
          ItemSeparatorComponent={Divider}
          renderItem={(item) => renderMemberItem(item)}
        />
      )}
    </View>
  );
};

export default GroupSettings;
