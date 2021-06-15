import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import CustomText from "../../components/customText/customText.component";
import LoadingPage from "../../components/loading-page/loading-page.component";

import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { useIsFocused } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import styles from "./profile.styles";

const Profile = ({ navigation }) => {
  const { request, loading, error, REST_API_LINK } = useHttp();
  const [user, setUser] = useContext(UserContext);
  const [stats, setStats] = useState({
    friends: 0,
    groups: 0,
    meetings: 0,
  });
  const isFocused = useIsFocused();
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    isFocused && getUserStats();
  }, [isFocused]);

  const getUserStats = async () => {
    try {
      const uid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();

      const friendshipsResponse = await request(
        `${REST_API_LINK}/api/users/friendships/${uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      const groupsResponse = await request(
        `${REST_API_LINK}/api/users/belongsTo/groups/${uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      const meetingsResponse = await request(
        `${REST_API_LINK}/api/meetings/userMeetings/${uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      setStats({
        friends: friendshipsResponse.friendships.length,
        groups: groupsResponse.groups.length,
        meetings: meetingsResponse.meetings.length,
      });
      setFirstLoading(false);
    } catch (error) {
      console.log("Error @ProfilePage/getUserData", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const signOut = async () => {
    try {
      setUser({
        uid: "",
        displayName: "",
        email: "",
        isLoggedIn: false,
        profilePhotoUrl: "default",
      });
      await auth.signOut();
    } catch (error) {
      console.log("Error @ProfilePage/signOut", error.message);
      Alert.alert("Error", error.message);
    }
  };

  if (firstLoading) return <LoadingPage />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.profilePhotoContainer}>
          <Image
            style={styles.profilePhoto}
            source={{ uri: user.profilePhotoUrl }}
          />
        </View>
        <Text style={styles.userName}>{user.displayName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statsItem}>
          <View style={styles.statsGroup}>
            <AntDesign name="heart" size={24} color="#ff0066" />
            <Text style={styles.statsText}> Friends </Text>
          </View>
          <Text style={styles.statsText}> {stats.friends} </Text>
        </View>
        <View style={styles.statsItem}>
          <View style={styles.statsGroup}>
            <AntDesign name="team" size={24} color="#8022d9" />
            <Text style={styles.statsText}> Groups </Text>
          </View>
          <Text style={styles.statsText}> {stats.groups} </Text>
        </View>
        <View style={styles.statsItem}>
          <View style={styles.statsGroup}>
            <AntDesign name="calendar" size={24} color="#23a6d5" />
            <Text style={styles.statsText}> Meetings </Text>
          </View>
          <Text style={styles.statsText}> {stats.meetings} </Text>
        </View>
        {
          <View style={styles.statsItem}>
            <View style={styles.statsGroup}>
              <AntDesign name="dashboard" size={24} color="#00cc99" />
              <Text style={styles.statsText}> Overall Score </Text>
            </View>
            <Text style={styles.statsText}>
              {" "}
              {stats.groups === 0
                ? 0
                : Math.round((stats.meetings / stats.groups) * 10)}{" "}
            </Text>
          </View>
        }
      </View>
      <TouchableOpacity
        style={styles.reportBugButton}
        onPress={() => {
          navigation.navigate("Report");
        }}
      >
        <Text style={styles.bugText}>Report a bug</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginHorizontal: 32,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ff0066",
          borderRadius: 6,
        }}
        onPress={async () => await signOut()}
      >
        <Text style={{ color: "#ffffff" }}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
