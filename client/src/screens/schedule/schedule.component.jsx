import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import CustomText from "../../components/customText/customText.component";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScheduleTimePickerIOS from "../../components/schedule-timepicker/schedule-timepicker-ios.component";
import ScheduleTimePickerAndroid from "../../components/schedule-timepicker/schedule-timepicker-android.component";
import {
  Button,
  ListItem,
  Divider,
  CheckBox,
  SelectItem,
} from "@ui-kitten/components";
import LoadingPage from "../../components/loading-page/loading-page.component";
import PollItem from "../../components/poll-item/poll-item.component";
import moment from "moment";

import { GroupContext } from "../../context/GroupContext";
import { auth, db } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { useIsFocused } from "@react-navigation/native";

import styles from "./schedule.styles";

const Schedule = ({ navigation, route }) => {
  const [group, setGroup] = useContext(GroupContext);
  const [meeting, setMeeting] = useState({
    startInterval: new Date(),
    endInterval: new Date(moment().add({ days: 1 }).valueOf()),
    duration: {
      hours: 0,
      minutes: 0,
    },
  });
  const { request, loading, error, REST_API_LINK } = useHttp();
  const isFocused = useIsFocused();
  const [fullLoading, setFullLoading] = useState(true);
  const [loadingScheduleSubmit, setLoadingScheduleSubmit] = useState(false);

  const [schedule, setSchedule] = useState([]);
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(moment().add({ hours: 2 })),
  });
  const [activities, setActivities] = useState([]);
  const [checked, setChecked] = useState({});
  const [activityName, setActivityName] = useState("");
  const [loadingAddActivity, setLoadingAddActivity] = useState(false);
  const [loadingActivitySubmit, setLoadingActivitySubmit] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  /* Backend Requests */
  useEffect(() => {
    isFocused && setMeeting({ ...group.meeting });
    isFocused && getUserSchedule();
    isFocused && getMeetingActivities();
    setFullLoading(false);
  }, [isFocused]);

  const getUserSchedule = useCallback(async () => {
    try {
      const uid = auth.currentUser.uid;
      const groupId = group.id;
      const token = await auth.currentUser.getIdToken();
      const response = await request(
        `${REST_API_LINK}/api/users/belongsTo/${uid}/${groupId}`,
        "GET",
        null,
        {
          Authorizaton: `Bearer ${token}`,
        }
      );
      setSchedule(response.schedule);
    } catch (error) {
      console.log("Error @Schedule/getUserSchedule: ", error.message);
      Alert.alert("Error", error.message);
    }
  }, []);

  const updateUserSchedule = async () => {
    setLoadingScheduleSubmit(true);
    try {
      const userUid = auth.currentUser.uid;
      const groupId = group.id;
      const token = await auth.currentUser.getIdToken();
      const response = await request(
        `${REST_API_LINK}/api/users/belongsTo/${userUid}`,
        "PUT",
        {
          schedule,
          userUid,
          groupId,
        },
        {
          Authorizaton: `Bearer ${token}`,
        }
      );
      Alert.alert("Success", response.message);
    } catch (error) {
      console.log("Error @Schedule/getUserSchedule: ", error.message);
      Alert.alert("Error", error.message);
    }
    setLoadingScheduleSubmit(false);
  };

  const getMeetingActivities = useCallback(async () => {
    try {
      const meetingId = group.meeting.id;
      const token = await auth.currentUser.getIdToken();
      const response = await request(
        `${REST_API_LINK}/api/meetings/activity/${meetingId}`,
        "GET",
        null,
        {
          Authorizaton: `Bearer ${token}`,
        }
      );

      const newChecked = {};
      let totalVotes = 0;
      for (const activity of response.activities) {
        newChecked[activity.id] = activity.votes.includes(auth.currentUser.uid);
        totalVotes += activity.votesNumber;
      }
      setActivities(response.activities);
      setChecked(newChecked);
      setTotalVotes(totalVotes);
    } catch (error) {
      console.log("Error @Schedule/getMeetingActivities: ", error.message);
      Alert.alert("Error", error.message);
    }
  }, []);

  const addActivity = async () => {
    setLoadingAddActivity(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const meetingId = meeting.id;
      const response = await request(
        `${REST_API_LINK}/api/meetings/activity`,
        "POST",
        {
          meetingId,
          name: activityName,
        },
        {
          Authorizaton: `Bearer ${token}`,
        }
      );
      await getMeetingActivities();
      Alert.alert("Succes", response.message);
    } catch (error) {
      console.log("Error @Schedule/addActivity: ", error.message);
      Alert.alert("Error", error.message);
    }
    setLoadingAddActivity(false);
  };

  const submitVotes = async () => {
    setLoadingActivitySubmit(true);
    try {
      const uid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();
      for (const activity of activities) {
        if (checked[activity.id]) {
          const response = await request(
            `${REST_API_LINK}/api/meetings/activity/addvote/${activity.id}`,
            "PUT",
            { uid },
            {
              Authorizaton: `Bearer ${token}`,
            }
          );
        }
      }

      const meetSnap = await db.collection("meetings").doc(meeting.id).get();
      const voted = meetSnap.data().voted;
      if (!voted.includes(uid)) {
        await db
          .collection("meetings")
          .doc(meeting.id)
          .update({ voted: [...voted, uid] });
      }
      Alert.alert("Success", "You have successfully submitted your votes");
    } catch (error) {
      console.log("Error @Schedule/submitVotes: ", error.message);
      Alert.alert("Error", error.message);
    }
    setLoadingActivitySubmit(false);
  };

  /* Schedule */
  const addIntervalToSchedule = () => {
    for (const sched of schedule) {
      if (JSON.stringify(sched) === JSON.stringify(range))
        return Alert.alert(
          "Warning",
          "The selected interval has been selected already"
        );
      if (
        moment(sched.startDate).valueOf() <=
          moment(range.startDate).valueOf() &&
        moment(range.endDate).valueOf() <= moment(sched.endDate).valueOf()
      )
        return Alert.alert(
          "Warning",
          "The selected interval is contained by another interval selected by you"
        );
    }
    const newSchedule = [
      ...schedule,
      {
        startDate: moment(range.startDate).valueOf(),
        endDate: moment(range.endDate).valueOf(),
      },
    ];
    setSchedule(newSchedule);
  };

  const removeItemFromSchedule = (item, key) => {
    const newSchedule = [...schedule];
    newSchedule.splice(key, 1);
    setSchedule(newSchedule);
  };

  const renderScheduleItem = (item, key) => (
    <ListItem
      key={key}
      title={`${moment(item.startDate).format(
        "MMMM Do YYYY, HH:mm"
      )} - ${moment(item.endDate).format("MMM Do YYYY, HH:mm")}`}
      accessoryLeft={() => (
        <MaterialCommunityIcons
          name="clock-time-two-outline"
          size={24}
          color="black"
        />
      )}
      accessoryRight={() => (
        <MaterialCommunityIcons
          name="window-close"
          size={24}
          color="black"
          onPress={() => removeItemFromSchedule(item, key)}
        />
      )}
    />
  );

  /* Activities */
  const selectOption = (item, newCheck) => {
    const newChecks = { ...checked };
    newChecks[item.id] = newCheck;
    setChecked(newChecks);
  };

  const renderActivityItem = (item, key) => (
    <View key={key}>
      <CheckBox
        checked={checked[item.id]}
        onChange={(newCheck) => selectOption(item, newCheck)}
        style={{ height: 30, marginBottom: 0, marginTop: 20 }}
      >
        {item.name}
      </CheckBox>
      <PollItem
        value={Math.round((item.votesNumber * 10000) / totalVotes) / 100}
      />
    </View>
  );

  return fullLoading ? (
    <View style={styles.container}>
      <LoadingPage />
    </View>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={120}
    >
      <ScrollView style={styles.container} nestedScrollEnabled={true}>
        <View style={styles.headerText}>
          <CustomText large center>
            The meeting hasn't been scheduled yet
          </CustomText>
          <CustomText medium center>
            Select the time intervals when you are available and suggest and/or
            vote an activity you want
          </CustomText>

          <CustomText
            medium
            center
            style={{ marginTop: 15 }}
          >{`Proposed meeting time: ${moment(meeting.startInterval).format(
            "MMM Do YYYY"
          )} - ${moment(meeting.endInterval)
            .subtract({ days: 1 })
            .format("MMM Do YYYY")}, Duration: ${moment(
            "2020-01-01T00:00:00.000"
          )
            .add({
              hours: meeting.duration.hours,
              minutes: meeting.duration.minutes,
            })
            .format("HH:mm")}`}</CustomText>
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Schedule</Text>
          <View style={styles.scheduleContent}>
            <ScrollView style={styles.scheduleList}>
              {schedule.length === 0 ? (
                <CustomText center style={{ marginTop: 15, marginBottom: 15 }}>
                  You haven't selected your schedule yet
                </CustomText>
              ) : (
                schedule.map((item, idx) => renderScheduleItem(item, idx))
              )}
            </ScrollView>
            <Divider />
            <View style={styles.scheduleSelector}>
              <CustomText medium bold center style={{ marginBottom: 25 }}>
                Time selector
              </CustomText>

              {Platform.OS === "ios" ? (
                <ScheduleTimePickerIOS
                  range={range}
                  setRange={setRange}
                  meeting={meeting}
                />
              ) : (
                <ScheduleTimePickerAndroid
                  range={range}
                  setRange={setRange}
                  meeting={meeting}
                />
              )}
              <View style={styles.scheduleButtonsContainer}>
                <Button
                  status="warning"
                  style={styles.scheduleButton}
                  onPress={addIntervalToSchedule}
                >
                  Add interval
                </Button>
                <Button
                  status="success"
                  style={styles.scheduleButton}
                  onPress={updateUserSchedule}
                >
                  {loadingScheduleSubmit ? (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={styles.loading}
                    />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Activities</Text>
          <View style={styles.scheduleContent}>
            <ScrollView style={styles.activityList}>
              {activities.length === 0 ? (
                <CustomText center style={{ marginTop: 15, marginBottom: 15 }}>
                  There are no activities yet
                </CustomText>
              ) : (
                activities.map((item, idx) => renderActivityItem(item, idx))
              )}
            </ScrollView>
            <Divider />
            <View style={styles.activitySelector}>
              <CustomText medium bold center style={{ marginBottom: 25 }}>
                Activity menu
              </CustomText>
              <View style={styles.input}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTitle}>Activity Name</Text>
                  <TextInput
                    style={styles.inputField}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(activityName) =>
                      setActivityName(activityName)
                    }
                    value={activityName}
                  />
                </View>
              </View>
              <View style={styles.scheduleButtonsContainer}>
                <Button
                  status="warning"
                  style={styles.scheduleButton}
                  onPress={addActivity}
                >
                  {loadingAddActivity ? (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={styles.loading}
                    />
                  ) : (
                    "Add interval"
                  )}
                </Button>
                <Button
                  status="success"
                  style={styles.scheduleButton}
                  onPress={submitVotes}
                >
                  {loadingActivitySubmit ? (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={styles.loading}
                    />
                  ) : (
                    "Vote"
                  )}
                </Button>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.selectButtonsContainer}>
          <Button onPress={() => console.log("Schedule Meeting")}>
            Schedule Meeting
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Schedule;
