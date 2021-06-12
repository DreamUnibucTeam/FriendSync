import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Icon, ListItem } from "@ui-kitten/components";
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../../firebase/firebase";
import { FirebaseContext } from "../../context/FirebaseContext";
import { ScrollView } from "react-native-gesture-handler";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import styles from "./home.styles";
import HomescreenContainer from "../../components/homescreen-container/homescreen-container.component";
import { useHttp } from "../../hooks/http.hook";
import { useIsFocused } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

const Home = ({ navigation }) => {
  const [loadingButton, setLoadingButton] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const { request, loading, error, REST_API_LINK } = useHttp();
  const [firstLoading, setFirstLoading] = useState(true);
  const isFocused = useIsFocused();

  const getAllFriendRequests = useCallback(async () => {
    try {
      const uid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/users/friendRequests/${uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      setFriendRequests(response.friendRequests);
    } catch (error) {
      console.log("Error @Home/getAllFriendRequests: ", error.message);
    }
  }, [request]);

  const getAllScheduledMeetings = useCallback(async () => {
    try {
      const uid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();

      const response = await request(
        `${REST_API_LINK}/api/meetings/userMeetings/${uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      setMeetings(response.meetings);
    } catch (error) {
      console.log("Error @Home/getAllFriendRequests: ", error.message);
      Alert.alert("Error", error.message);
    }
    setFirstLoading(false);
  }, []);

  useEffect(() => {
    // setFirstLoading(true);
    isFocused && getAllFriendRequests();
    isFocused && getAllScheduledMeetings();
  }, [isFocused]);

  /* Functions for friend requests part */
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
      await getAllFriendRequests();
      setLoadingButton(null);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @Home/acceptFriendRequest: ", error.message);
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
      await getAllFriendRequests();
      setLoadingButton(null);
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @Home/rejectFriendRequest: ", error.message);
      setLoadingButton(null);
      Alert.alert("Error", error.message);
    }
  };

  const ActionButtons = (item) => {
    const key = item.friendRequestId;
    return (
      <>
        <Button
          size="tiny"
          status="success"
          onPress={() =>
            acceptFriendRequest(key + "Accept", item.friendRequestId, item.uid)
          }
          style={styles.actionButtons}
          disabled={loadingButton}
        >
          {loadingButton == key + "Accept" ? (
            <ActivityIndicator color="#fff" style={styles.loading} />
          ) : (
            "Accept"
          )}
        </Button>
        <Button
          size="tiny"
          status="danger"
          onPress={() =>
            rejectFriendRequest(key + "Reject", item.friendRequestId)
          }
          style={styles.actionButtons}
        >
          {loadingButton == key + "Rejecet" ? (
            <ActivityIndicator color="#fff" style={styles.loading} />
          ) : (
            "Reject"
          )}
        </Button>
      </>
    );
  };

  const ItemIcon = (props) => <Icon {...props} name="person" />;

  const renderFriendRequest = (item) => (
    <ListItem
      key={item.friendRequestId}
      title={item.name}
      style={styles.listItem}
      accessoryLeft={ItemIcon}
      accessoryRight={() => ActionButtons(item)}
    />
  );

  /* Functions for groups part */
  const navigateToGroup = (id) => {
    alert("Navigate to ", id);
  };

  const ArrowIcon = (props) => (
    <AntDesign name="right" size={24} color="black" />
  );

  const renderGroupMeeting = (item) => (
    <ListItem
      key={item.id}
      title={item.name}
      description={`Meeting in ${item.groupName}`}
      style={styles.listItem}
      // accessoryRight={ArrowIcon}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FocusAwareStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={Platform.OS == "android" ? "#000" : ""}
      />
      <Spinner
        visible={firstLoading}
        textContent={"Loading homepage..."}
        textStyle={{ color: "#fff" }}
      />
      <View style={styles.headerGraphic}>
        <View style={styles.rightCircle} />
        <View style={styles.leftCircle} />
      </View>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Home</Text>
        </View>
        <HomescreenContainer title="Friend Requests">
          <ScrollView>
            {friendRequests.length === 0 ? (
              <Text
                style={{
                  height: 50,
                  fontSize: 14,
                  textAlign: "center",
                  paddingTop: 17,
                }}
              >
                You don't have any friend requests
              </Text>
            ) : (
              friendRequests.map((friendRequest) =>
                renderFriendRequest(friendRequest)
              )
            )}
          </ScrollView>
        </HomescreenContainer>
        <HomescreenContainer title="Next meetings">
          <ScrollView>
            {meetings.length === 0 ? (
              <Text
                style={{
                  height: 50,
                  fontSize: 14,
                  textAlign: "center",
                  paddingTop: 17,
                }}
              >
                You don't have any scheduled meetings
              </Text>
            ) : (
              meetings.map((meeting) => renderGroupMeeting(meeting))
            )}
          </ScrollView>
        </HomescreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
