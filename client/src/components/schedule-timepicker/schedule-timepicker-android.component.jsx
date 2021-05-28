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

import styles from "./schedule-timepicker.style";

const ScheduleTimepickerAndroid = ({ range, setRange, meeting }) => {
  /* Platform related */
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const selectStartDate = (event, selectedDate) => {
    setShowStartDate(false);
    setShowStartTime(false);
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
    setShowEndDate(false);
    setShowEndTime(false);
    const newEndDate =
      moment(range.startDate).unix() >= moment(selectedDate).unix()
        ? new Date(moment(range.startDate).add({ hours: 1 }))
        : selectedDate;
    setRange({
      ...range,
      endDate: newEndDate,
    });
  };

  return (
    <View style={styles.scheduleTimes}>
      <View style={styles.timeContainer}>
        <CustomText medium bold center style={{ marginBottom: 10 }}>
          Start time
        </CustomText>
        <View style={styles.androidScheduler}>
          <CustomText>
            {moment(range.startDate).format("MMMM Do YYYY, HH:mm")}
          </CustomText>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
              size="small"
              status="info"
              style={{ marginTop: 10, marginHorizontal: 5 }}
              onPress={() => setShowStartDate(true)}
            >
              Change start date
            </Button>
            <Button
              size="small"
              status="info"
              style={{ marginTop: 10, marginHorizontal: 5 }}
              onPress={() => setShowStartTime(true)}
            >
              Change start time
            </Button>
          </View>
        </View>
        {showStartDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={range.startDate}
            minimumDate={new Date()}
            maximumDate={new Date(meeting.endInterval)}
            mode={"date"}
            is24Hour={true}
            display="default"
            onChange={selectStartDate}
            style={{
              // marginLeft: 75,
              width: 125,
              marginHorizontal: 5,
            }}
            // display="spinner"
          />
        )}
        {showStartTime && (
          <DateTimePicker
            testID="dateTimePicker"
            value={range.startDate}
            minimumDate={new Date()}
            maximumDate={new Date(meeting.endInterval)}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={selectStartDate}
            style={{
              width: 70,
              marginHorizontal: 5,
            }}
            // display="spinner"
          />
        )}
      </View>
      <View style={styles.timeContainer}>
        <CustomText medium bold center style={{ marginBottom: 10 }}>
          End time
        </CustomText>
        <View style={styles.androidScheduler}>
          <CustomText>
            {moment(range.endDate).format("MMMM Do YYYY, HH:mm")}
          </CustomText>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
              size="small"
              status="info"
              style={{ marginTop: 10, marginHorizontal: 5 }}
              onPress={() => setShowEndDate(true)}
            >
              Change end date
            </Button>
            <Button
              size="small"
              status="info"
              style={{ marginTop: 10, marginHorizontal: 5 }}
              onPress={() => setShowEndTime(true)}
            >
              Change end time
            </Button>
          </View>
        </View>
        {showEndDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={range.endDate}
            minimumDate={range.startDate}
            maximumDate={new Date(meeting.endInterval)}
            mode={"date"}
            is24Hour={true}
            display="default"
            onChange={selectEndDate}
            style={{ width: 125, marginHorizontal: 5 }}
          />
        )}
        {showEndTime && (
          <DateTimePicker
            testID="dateTimePicker"
            value={range.endDate}
            minimumDate={range.startDate}
            maximumDate={new Date(meeting.endInterval)}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={selectEndDate}
            style={{ width: 125, marginHorizontal: 5 }}
          />
        )}
      </View>
    </View>
  );
};

export default ScheduleTimepickerAndroid;
