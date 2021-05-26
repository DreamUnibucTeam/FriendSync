import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useHttp } from "../../hooks/http.hook";
import { GroupContext } from "../../context/GroupContext";
import { useIsFocused } from "@react-navigation/native";

import CustomListItem from "../../components/customListItem/customListItem.component";
import CustomText from "../../components/customText/customText.component";
import LoadingPage from "../../components/loading-page/loading-page.component";

import styles from "./meetings.styles";
import { auth } from "../../firebase/firebase";

const Meetings = ({ navigation }) => {
  const [firstLoading, setFirstLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [group, setGroup] = useContext(GroupContext);
  const { request, loading, error, REST_API_LINK } = useHttp();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && getAllMeetings();
    isFocused && setGroup({ ...group, meeting: null });
  }, [isFocused]);

  const getAllMeetings = useCallback(async () => {
    try {
      const uid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();
      const groupId = group.id;
      const response = await request(
        `${REST_API_LINK}/api/meetings/group/${groupId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setMeetings(response.meetings);
      setFirstLoading(false);
    } catch (error) {
      console.log("Error @Meetings/getAllMeetings: ");
    }
  }, []);

  return (
    <View style={styles.container}>
      {firstLoading ? (
        <LoadingPage />
      ) : JSON.stringify(meetings) === JSON.stringify([]) ? (
        <View style={styles.noMeetings}>
          <MaterialIcons name="park" size={100} color="black" />
          <CustomText bold large center>
            There are no scheduled meetings yet
          </CustomText>
          <CustomText center>
            Tap the button below to add a new meetings or wait until other
            members create one
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={meetings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomListItem
              name={item.name}
              onPress={() => {
                setGroup({
                  ...group,
                  meeting: item,
                }),
                  navigation.navigate("MeetingStack", {
                    screen: "Schedule",
                    params: {
                      id: item.id,
                      meetingName: item.name,
                    },
                  });
              }}
            />
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitContainer}
          onPress={() => navigation.navigate("AddMeeting")}
        >
          <CustomText bold center color="#fff">
            Add new meeting
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Meetings;
