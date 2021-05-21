import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "./friends.styles";
import moment from "moment";

import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import Spinner from "react-native-loading-spinner-overlay";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { UserContext } from "../../context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import CustomText from "../../components/customText/customText.component";
import { ListItem, Divider, Avatar, Button } from "@ui-kitten/components";

const Friends = ({ navigation }) => {
  const { request, loading, error, REST_API_LINK } = useHttp();
  const [loadingButton, setLoadingButton] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [user, _] = useContext(UserContext);
  const isFocused = useIsFocused();

  const getFriends = useCallback(async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const data = await request(
        `${REST_API_LINK}/api/users/friendships/${user.uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      // console.log(data.friendships);
      setFriendsList(data.friendships);
    } catch (error) {
      console.log("Error @FriendsComponent/getFriends: ", error.message);
    }
  }, [request]);

  useEffect(() => {
    isFocused && getFriends();
  }, [getFriends, isFocused]);

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
      await getFriends();
      setLoadingButton(null);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @AddFriend/removeFriend: ", error.message);
      setLoadingButton(null);
      Alert.alert("Error", error.message);
    }
  };

  /* List items */
  const userProfilePhoto = (profilePhotoUrl) => (
    <Avatar source={{ uri: profilePhotoUrl }} />
  );

  const userButton = (item) => {
    const key = item.uid;

    return (
      <Button
        size="small"
        status="danger"
        onPress={() => removeFriend(key, item.friendshipId)}
        disabled={loadingButton == key}
      >
        {loadingButton == key ? (
          <ActivityIndicator style={styles.loading} color="#fff" />
        ) : (
          "Remove"
        )}
      </Button>
    );
  };

  const renderFriendItem = ({ item }) => (
    <ListItem
      title={`${item.name}`}
      description={`Friends since ${moment(new Date(item.startDate)).format(
        "LL"
      )}`}
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
      <Spinner
        visible={loading}
        textContent={"Loading friends..."}
        textStyle={{ color: "#fff" }}
      />
      {!loading && JSON.stringify(friendsList) === JSON.stringify([]) ? (
        <View style={styles.noFriends}>
          <MaterialCommunityIcons
            name="account-search"
            size={100}
            color="black"
          />
          <CustomText bold large>
            You don't have any friends yet
          </CustomText>
          <CustomText>Tap the + icon to search and find new friends</CustomText>
        </View>
      ) : (
        <FlatList
          data={friendsList}
          keyExtractor={(item) => item.friendshipId}
          ItemSeparatorComponent={Divider}
          renderItem={(item) => renderFriendItem(item)}
        />
      )}
    </View>
  );
};

export default Friends;
