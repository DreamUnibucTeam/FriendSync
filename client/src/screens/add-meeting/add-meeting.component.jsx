import React, { useState, useContext } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { RangeCalendar, Button } from "@ui-kitten/components";
import moment from "moment";

import { AntDesign } from "@expo/vector-icons";

import styles from "./add-meeting.styles";

import CustomText from "../../components/customText/customText.component";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { GroupContext } from "../../context/GroupContext";
import { ScrollView } from "react-native";

const AddMeeting = ({ navigation }) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("03:00");
  const [timePickerValue, setTimePickerValue] = useState(
    new Date("2021-01-01T03:00:00.000Z")
  );
  const [show, setShow] = useState(Platform.OS === "ios");
  const [range, setRange] = useState({});
  const [realRange, setRealRange] = useState({});
  const [group, setGroup] = useContext(GroupContext);
  const { request, loading, error, REST_API_LINK } = useHttp();

  const createMeeting = async () => {
    try {
      if (JSON.stringify(realRange) === JSON.stringify({})) {
        throw new Error("Choose at least one day in the calendar to continue");
      }

      const hours = parseInt(duration.split(":")[0]);
      const minutes = parseInt(duration.split(":")[1]);
      const groupId = group.id;
      const token = await auth.currentUser.getIdToken();
      const response = await request(
        `${REST_API_LINK}/api/meetings/meeting`,
        "POST",
        {
          name,
          groupId,
          startInterval: moment(realRange.startDate).valueOf(),
          endInterval: moment(realRange.endDate).valueOf(),
          duration: {
            hours,
            minutes,
          },
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      Alert.alert("Success", response.message);
      navigation.navigate("GroupMeetings");
    } catch (error) {
      console.log("Error @AddMeeting/createMeeting: ", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const selectedRange = (nextRange) => {
    setRange(nextRange);
    const newEndDate =
      nextRange.endDate === null
        ? new Date(moment(nextRange.startDate).add({ days: 1 }))
        : new Date(moment(nextRange.endDate).add({ days: 1 }));
    setRealRange({ ...nextRange, endDate: newEndDate });
  };

  const selectDuration = (time) => {
    setShow(Platform.OS === "ios");
    const durata = time.toISOString().split("T")[1].substring(0, 5);
    setTimePickerValue(time);
    setDuration(durata);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
          <View style={styles.main}>
            <CustomText title center>
              Plan a new meeting
            </CustomText>

            <View style={styles.input}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Name</Text>
                <TextInput
                  style={styles.inputField}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(name) => setName(name)}
                  value={name}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>
                  Choose a period of time for the meeting
                </Text>
              </View>
              <View style={styles.calendarContainer}>
                <RangeCalendar
                  range={range}
                  min={new Date()}
                  onSelect={(nextRange) => {
                    selectedRange(nextRange);
                  }}
                />
              </View>

              <View style={{ ...styles.inputContainer, marginBottom: 15 }}>
                <Text style={styles.inputTitle}>
                  Choose the duration of the meeting
                </Text>
              </View>
              <CustomText
                medium
                center
                style={{ marginBottom: 15 }}
              >{`Duration: ${duration}`}</CustomText>
              {Platform.OS === "android" ? (
                <Button
                  status="warning"
                  style={{ width: "50%", alignSelf: "center" }}
                  onPress={() => setShow(true)}
                >
                  Change duration
                </Button>
              ) : null}
              {show && (
                <View style={styles.timePickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={timePickerValue}
                    mode={"time"}
                    is24Hour={true}
                    timeZoneOffsetInMinutes={0}
                    display="spinner"
                    onChange={(event, time) => selectDuration(time)}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.submitContainer}
              onPress={createMeeting}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator style={styles.loading} color="#fff" />
              ) : (
                <CustomText bold center color="#fff">
                  Add meeting
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddMeeting;
