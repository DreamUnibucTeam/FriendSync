import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
} from "react-native";
import { Button, Icon, ListItem } from "@ui-kitten/components";
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../../firebase/firebase";
import { FirebaseContext } from "../../context/FirebaseContext";
import { ScrollView } from "react-native-gesture-handler";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import styles from "./home.styles";
import HomescreenContainer from "../../components/homescreen-container/homescreen-container.component";

const data = new Array(8).fill({
  title: "Item",
});

const Home = ({ navigation }) => {
  const [meetings, setMeetings] = useState([]);
  const [friendRequests, setFriendRequests] = useState([
    {
      friendRequestId: "1",
      uid: "1",
      name: "Friend 1",
    },
    {
      friendRequestId: "2",
      uid: "2",
      name: "Friend 2",
    },
    {
      friendRequestId: "3",
      uid: "3",
      name: "Friend 3",
    },
    {
      friendRequestId: "4",
      uid: "4",
      name: "Friend 4",
    },
    {
      friendRequestId: "5",
      uid: "5",
      name: "Friend 5",
    },
    {
      friendRequestId: "6",
      uid: "6",
      name: "Friend 6",
    },
    {
      friendRequestId: "7",
      uid: "7",
      name: "Friend 7",
    },
  ]);

  /* Functions for friend requests part */
  const acceptFriendRequest = (id, name) => {
    alert(`Accept, ${id}, ${name}`);
  };

  const rejectFriendRequest = (id, name) => {
    alert(`Reject, ${id}, ${name}`);
  };

  const ActionButtons = (id, name) => {
    return (
      <>
        <Button
          size="tiny"
          status="success"
          onPress={() => acceptFriendRequest(id, name)}
          style={styles.actionButtons}
        >
          Accept
        </Button>
        <Button
          size="tiny"
          status="danger"
          onPress={() => rejectFriendRequest(id, name)}
          style={styles.actionButtons}
        >
          Reject
        </Button>
      </>
    );
  };

  const ItemIcon = (props) => <Icon {...props} name="person" />;

  const renderFriendRequest = ({ friendRequestId, name }) => (
    <ListItem
      key={friendRequestId}
      title={name}
      style={styles.listItem}
      accessoryLeft={ItemIcon}
      accessoryRight={() => ActionButtons(friendRequestId, name)}
    />
  );

  /* Functions for groups part */
  const navigateToGroup = (id) => {
    alert("Navigate to ", id);
  };

  const ArrowIcon = (props) => (
    <AntDesign name="right" size={24} color="black" />
  );

  const renderGroupMeeting = ({ meetingId, groupName }) => {
    <ListItem
      key={meetingId}
      title="Meeting 1"
      description="Group 1"
      style={styles.listItem}
      accessoryRight={ArrowIcon}
      onPress={() => navigateToGroup(id)}
    />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FocusAwareStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={Platform.OS == "android" ? "#000" : ""}
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
        <View>
          <Text>{auth.currentUser.uid}</Text>
          <Text>{auth.currentUser.email}</Text>
        </View>
        <TouchableOpacity
          style={{
            marginHorizontal: 32,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#8022d8",
            borderRadius: 6,
          }}
          onPress={() => auth.signOut()}
        >
          <Text>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

{
  // <TouchableOpacity
  //   style={{
  //     marginHorizontal: 32,
  //     height: 48,
  //     alignItems: "center",
  //     justifyContent: "center",
  //     backgroundColor: "#8022d8",
  //     borderRadius: 6,
  //   }}
  //   onPress={() => auth.signOut()}
  // >
  //   <Text>Sign out</Text>
  // </TouchableOpacity>
}
