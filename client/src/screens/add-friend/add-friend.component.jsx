import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import styles from "./add-friend.styles";

import { FontAwesome } from "@expo/vector-icons";
import { ListItem, Button, Avatar, Divider } from "@ui-kitten/components";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import CustomText from "../../components/customText/customText.component";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { SearchBar } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { FlatList } from "react-native";
import { Alert } from "react-native";

const AddFriend = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [loadingButton, setLoadingButton] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const { request, loading, error, REST_API_LINK } = useHttp();
  const isFocused = useIsFocused();

  /* User actions */
  const sendFriendRequest = async (key, toUid) => {
    try {
      setLoadingButton(key);
      const fromUid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/users/friendRequests`,
        "POST",
        {
          fromUid,
          toUid,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      await getAllUsers();
      filterResults(search);
      setLoadingButton(null);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @AddFriend/sendFriendRequest: ", error.message);
      setLoadingButton(null);
      Alert.alert("Error", error.message);
    }
  };

  const acceptFriendRequest = async (key, relationId, userUid) => {
    try {
      setLoadingButton(key);
      const uid1 = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/users/friendRequests/${relationId}`,
        "POST",
        {
          uid1,
          uid2: userUid,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      await getAllUsers();
      filterResults(search);
      setLoadingButton(null);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @AddFriend/acceptFriendRequest: ", error.message);
      setLoadingButton(null);
      Alert.alert("Error", error.message);
    }
  };

  const rejectFriendRequest = async (key, relationId) => {
    try {
      setLoadingButton(key);
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/users/friendRequests/${relationId}`,
        "DELETE",
        {
          Authorization: `Bearer ${token}`,
        }
      );
      await getAllUsers();
      filterResults(search);
      setLoadingButton(null);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @AddFriend/rejectFriendRequest: ", error.message);
      setLoadingButton(null);
      Alert.alert("Error", error.message);
    }
  };

  const removeFriend = async (key, relationId) => {
    try {
      setLoadingButton(key);
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/users/friendships/${relationId}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      await getAllUsers();
      filterResults(search);
      setLoadingButton(null);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @AddFriend/removeFriend: ", error.message);
      setLoadingButton(null);
      Alert.alert("Error", error.message);
    }
  };

  /* Search functions */
  useEffect(() => {
    getAllUsers();
  }, [isFocused]);

  const getAllUsers = useCallback(async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const uid = auth.currentUser.uid;
      const data = await request(
        `${REST_API_LINK}/api/users/relations/${uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setUsersList(data.users);
    } catch (error) {
      console.log("Error @AddFriend/getAllUsers: ", error.message);
    }
  }, [request]);

  const filterResults = (search) => {
    const filtered = usersList.filter(
      (user) =>
        user.displayName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const showResults = (search) => {
    setSearch(search);
    if (search === "") setFilteredList([]);
    else filterResults(search);
  };

  /* List items */
  const userProfilePhoto = (profilePhotoUrl) => (
    <Avatar source={{ uri: profilePhotoUrl }} />
  );

  const userButton = (item) => {
    const key = item.userUid;
    if (!item.relation)
      return (
        <Button
          size="small"
          onPress={() => sendFriendRequest(key, item.userUid)}
          disabled={loadingButton}
        >
          {loadingButton == key ? (
            <ActivityIndicator style={styles.loading} color="#fff" />
          ) : (
            "Add Friend"
          )}
        </Button>
      );
    if (item.relation.relation === "Friends")
      return (
        <Button
          size="small"
          status="danger"
          onPress={() => removeFriend(key, item.relation.relationId)}
          disabled={loadingButton}
        >
          {loadingButton == key ? (
            <ActivityIndicator style={styles.loading} color="#fff" />
          ) : (
            "Remove Friend"
          )}
        </Button>
      );
    else if (item.relation.relation === "Received Friend Request")
      return (
        <>
          <Button
            size="small"
            status="success"
            style={{ marginRight: 5 }}
            onPress={() =>
              acceptFriendRequest(
                key + "Accept",
                item.relation.relationId,
                item.userUid
              )
            }
            disabled={loadingButton}
          >
            {loadingButton == key + "Accept" ? (
              <ActivityIndicator style={styles.loading} color="#fff" />
            ) : (
              "Accept"
            )}
          </Button>
          <Button
            size="small"
            status="danger"
            onPress={() =>
              rejectFriendRequest(key + "Reject", item.relation.relationId)
            }
            disabled={loadingButton}
          >
            {loadingButton == key + "Reject" ? (
              <ActivityIndicator style={styles.loading} color="#fff" />
            ) : (
              "Reject"
            )}
          </Button>
        </>
      );
    else if (item.relation.relation === "Sent Friend Request")
      return (
        <Button size="small" disabled={true}>
          Sent Request
        </Button>
      );
  };

  const renderUserItem = ({ item }) => (
    <ListItem
      title={`${item.displayName}`}
      description={`${item.email}`}
      accessoryLeft={() => userProfilePhoto(item.profilePhotoUrl)}
      accessoryRight={() => userButton(item)}
      style={{ height: 80, paddingHorizontal: 30 }}
    />
  );

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={Platform.OS === "android" ? "#000" : ""}
      />

      <SearchBar
        round={true}
        showCancel={true}
        showLoading={loading}
        containerStyle={{ backgroundColor: "#fff" }}
        inputContainerStyle={{ height: 40, marginHorizontal: 10 }}
        inputStyle={{ color: "#000" }}
        placeholder="Enter a user's name or email"
        onChangeText={(search) => showResults(search)}
        lightTheme="true"
        value={search}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
        {JSON.stringify(filteredList) === JSON.stringify([]) ? (
          <View style={styles.noUsers}>
            <FontAwesome name="search" size={100} color="black" />
            <CustomText bold large>
              Search users
            </CustomText>
            <CustomText>Search users by their email or name</CustomText>
          </View>
        ) : (
          <FlatList
            data={filteredList}
            ItemSeparatorComponent={Divider}
            keyExtractor={(item) => item.userUid}
            renderItem={(item) => renderUserItem(item)}
          />
        )}
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AddFriend;
