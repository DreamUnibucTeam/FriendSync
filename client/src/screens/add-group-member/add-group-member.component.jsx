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
import styles from "./add-group-member.styles";

import LoadingPage from "../../components/loading-page/loading-page.component";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ListItem, Button, Avatar, Divider } from "@ui-kitten/components";
import CustomText from "../../components/customText/customText.component";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { SearchBar } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { GroupContext } from "../../context/GroupContext";

const AddGroupMember = ({ navigation }) => {
  const [group, setGroup] = useContext(GroupContext);
  const [firstLoading, setFirstLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(null);
  const { request, loading, error, REST_API_LINK } = useHttp();
  const [users, setUsers] = useState([]);
  const [memberIds, setMemberIds] = useState(new Set());
  const isFocused = useIsFocused();

  const getFriendsInformation = useCallback(async () => {
    try {
      const uid = auth.currentUser.uid;
      const groupId = group.id;
      const token = await auth.currentUser.getIdToken();

      const friendsResponse = await request(
        `${REST_API_LINK}/api/users/friendships/${uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      setUsers(friendsResponse.friendships);

      const membersResponse = await request(
        `${REST_API_LINK}/api/groups/group/${groupId}/members`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const memberIdsList = membersResponse.members.map((member) => member.uid);
      setMemberIds(new Set(memberIdsList));
      setFirstLoading(false);
    } catch (error) {
      console.log(
        "Error @AddGroupMember/getFriendsInformation: ",
        error.message
      );
      Alert.alert("Error", error.message);
    }
  }, [group]);

  useEffect(() => {
    isFocused && getFriendsInformation();
  }, [isFocused]);

  const addUserToGroup = async (key, userUid) => {
    try {
      setLoadingButton(key);
      const adminUid = auth.currentUser.uid;
      const groupId = group.id;
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/users/belongsTo`,
        "POST",
        {
          adminUid,
          userUid,
          groupId,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      Alert.alert("Succes", response.message);
      await getFriendsInformation();
      setLoadingButton(null);
    } catch (error) {
      setLoadingButton(null);
      console.log("Error @AddGroupMember/addUserToGroup: ", error.message);
      Alert.alert("Error", error.message);
    }
  };

  /* List items */
  const userProfilePhoto = (profilePhotoUrl) => (
    <Avatar source={{ uri: profilePhotoUrl }} />
  );

  const userButton = (item) => {
    const key = item.uid;
    const isMember = memberIds.has(item.uid);
    return (
      <Button
        size="small"
        status="success"
        disabled={isMember}
        onPress={() => addUserToGroup(key, item.uid)}
      >
        {loadingButton === item.uid ? (
          <ActivityIndicator style={styles.firstLoading} color="#000" />
        ) : !isMember ? (
          "Add"
        ) : (
          "Member"
        )}
      </Button>
    );
  };

  const renderUserItem = ({ item }) => (
    <ListItem
      title={`${item.name}`}
      accessoryLeft={() => userProfilePhoto(item.profilePhotoUrl)}
      accessoryRight={() => userButton(item)}
      style={{ height: 80, paddingHorizontal: 30 }}
    />
  );

  return (
    <View style={styles.container}>
      {firstLoading ? (
        <LoadingPage />
      ) : JSON.stringify(users) === JSON.stringify([]) ? (
        <View style={styles.noFriends}>
          <MaterialCommunityIcons
            name="account-search"
            size={100}
            color="black"
          />
          <CustomText bold large>
            You don't have any friends yet
          </CustomText>
          <CustomText>
            Go to the Friends section and find your friends
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          ItemSeparatorComponent={Divider}
          renderItem={(item) => renderUserItem(item)}
        />
      )}
    </View>
  );
};

export default AddGroupMember;
