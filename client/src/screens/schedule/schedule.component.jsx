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
  RangeCalendar,
  Divider,
} from "@ui-kitten/components";
import LoadingPage from "../../components/loading-page/loading-page.component";
import moment from "moment";

import { GroupContext } from "../../context/GroupContext";
import { auth } from "../../firebase/firebase";
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

  /* Backend Requests */
  useEffect(() => {
    isFocused && setMeeting({ ...group.meeting });
    isFocused && getUserSchedule();
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
      setActivities(response.activities);
    } catch (error) {
      console.log("Error @Schedule/getMeetingActivities: ", error.message);
      Alert.alert("Error", error.message);
    }
  }, []);

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

  return fullLoading ? (
    <View style={styles.container}>
      <LoadingPage />
    </View>
  ) : (
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
          .format("MMM Do YYYY")}, Duration: ${moment("2020-01-01T00:00:00.000")
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
          <Text>Idk</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Schedule;
