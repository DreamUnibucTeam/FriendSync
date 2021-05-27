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

import CustomText from "../../components/customText/customText.component";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [meeting, setMeeting] = useState({});
  const { request, loading, error, REST_API_LINK } = useHttp();
  const isFocused = useIsFocused();

  const [schedule, setSchedule] = useState([]);
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(moment().add({ hours: 2 })),
  });
  const [activities, setActivities] = useState([]);

  /* Platform related */
  const [showStart, setShowStart] = useState(Platform.OS === "ios");
  const [showEnd, setShowEnd] = useState(Platform.OS === "ios");

  /* Backend Requests */
  useEffect(() => {
    isFocused && setMeeting(group.meeting);
  }, [isFocused]);

  const getUserSchedule = useCallback(async () => {
    try {
      const uid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();
    } catch (error) {
      console.log("Error @Schedule/getUserSchedule: ", error.message);
      Alert.alert("Error", error.message);
    }
  }, []);

  const getMeetingActivities = useCallback(async () => {
    try {
      const meetingId = group.meeting.id;
      const token = await auth.currentUser.getIdToken();
    } catch (error) {
      console.log("Error @Schedule/getMeetingActivities: ", error.message);
      Alert.alert("Error", error.message);
    }
  }, []);

  /* Schedule */
  const selectStartDate = (event, selectedDate) => {
    // console.log(moment(selectedDate).unix() < moment().unix());
    setShowStart(Platform.OS === "ios");
    const newStartDate =
      moment(selectedDate).unix() < moment().unix() ? new Date() : selectedDate;
    const newEndDate =
      moment(newStartDate).unix() < moment(range.endDate).unix()
        ? range.endDate
        : new Date(moment(newStartDate).add({ hours: 1 }));
    setRange({
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  const selectEndDate = (event, selectedDate) => {
    setShowStart(Platform.OS === "ios");
    const newEndDate =
      moment(range.startDate).unix() >= moment(selectedDate).unix()
        ? new Date(moment(range.startDate).add({ hours: 1 }))
        : selectedDate;
    setRange({
      ...range,
      endDate: newEndDate,
    });
  };

  const renderScheduleItem = () => {
    return <ListItem />;
  };

  return false ? (
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
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>Schedule</Text>
        <View style={styles.scheduleContent}>
          <ScrollView style={styles.scheduleList}>
            {schedule.length === 0 ? (
              <CustomText center style={{ marginTop: 20, marginBottom: 25 }}>
                You haven't selected your schedule yet
              </CustomText>
            ) : null}
          </ScrollView>
          <Divider />
          <View style={styles.scheduleSelector}>
            <CustomText medium bold center style={{ marginBottom: 25 }}>
              Time selector
            </CustomText>
            <View style={styles.scheduleTimes}>
              <View style={styles.timeContainer}>
                <CustomText medium bold center style={{ marginBottom: 10 }}>
                  Start time
                </CustomText>
                {Platform.OS === "android" ? (
                  <View style={styles.androidScheduler}>
                    <CustomText>
                      {moment(range.startDate).format("MMMM Do YYYY, HH:mm")}
                    </CustomText>
                    <Button
                      size="small"
                      style={{ marginTop: 10 }}
                      onPress={() => setShowStart(true)}
                    >
                      Change start time
                    </Button>
                  </View>
                ) : null}
                {showStart && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={range.startDate}
                    minimumDate={new Date()}
                    maximumDate={new Date(moment().add({ days: 10 }))}
                    mode={"datetime"}
                    is24Hour={true}
                    display="default"
                    onChange={selectStartDate}
                    style={{ marginLeft: 75 }}
                    // display="spinner"
                  />
                )}
              </View>
              <View style={styles.timeContainer}>
                <CustomText medium bold center style={{ marginBottom: 10 }}>
                  End time
                </CustomText>
                {Platform.OS === "android" ? (
                  <View style={styles.androidScheduler}>
                    <CustomText>
                      {moment(range.endDate).format("MMMM Do YYYY, HH:mm")}
                    </CustomText>
                    <Button
                      size="small"
                      style={{ marginTop: 10 }}
                      onPress={() => setShowEnd(true)}
                    >
                      Change end time
                    </Button>
                  </View>
                ) : null}
                {showEnd && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={range.endDate}
                    minimumDate={range.startDate}
                    maximumDate={new Date(moment().add({ days: 10 }))}
                    mode={"datetime"}
                    is24Hour={true}
                    display="default"
                    onChange={selectEndDate}
                    style={{ marginLeft: 75 }}
                  />
                )}
              </View>
            </View>
            <View style={styles.scheduleButtonsContainer}>
              <Button
                status="warning"
                style={styles.scheduleButton}
                onPress={() => console.log("Add interval")}
              >
                Add interval
              </Button>
              <Button
                status="success"
                style={styles.scheduleButton}
                onPress={() => console.log("Submit")}
              >
                Submit
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
