import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, Platform, FlatList } from "react-native";
import styles from "./friends.styles";

import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import Spinner from "react-native-loading-spinner-overlay";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { UserContext } from "../../context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import CustomText from "../../components/customText/customText.component";
import { List, Divider } from "@ui-kitten/components";

const Friends = ({ navigation }) => {
  const { request, loading, error, REST_API_LINK } = useHttp();
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
      // console.log(data.groups);
      setFriendsList(data.friendships);
    } catch (error) {
      console.log("Error @FriendsComponent/getFriends: ", error.message);
    }
  }, [request]);

  useEffect(() => {
    isFocused && getFriends();
  }, [getFriends, isFocused]);

  const renderFriendItem = ({ item }) => {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  };

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
          renderItem={(item) => console.log("Ops")}
        />
      )}
    </View>
  );
};

export default Friends;
