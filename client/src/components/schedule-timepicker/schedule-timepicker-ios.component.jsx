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

const ScheduleTimepickerIOS = ({ range, setRange, meeting }) => {
  /* Schedule */
  const selectStartDate = (event, selectedDate) => {
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
        <View style={styles.timePickers}>
          <DateTimePicker
            testID="dateTimePicker"
            value={range.startDate}
            minimumDate={new Date()}
            maximumDate={new Date(meeting.endInterval)}
            mode={"datetime"}
            is24Hour={true}
            display="default"
            onChange={selectStartDate}
            style={{
              width: 200,
            }}
          />
        </View>
      </View>
      <View style={styles.timeContainer}>
        <CustomText medium bold center style={{ marginBottom: 10 }}>
          End time
        </CustomText>
        <View style={styles.timePickers}>
          <DateTimePicker
            testID="dateTimePicker"
            value={range.endDate}
            minimumDate={range.startDate}
            maximumDate={new Date(meeting.endInterval)}
            mode={"datetime"}
            is24Hour={true}
            display="default"
            onChange={selectEndDate}
            style={{ width: 200 }}
          />
        </View>
      </View>
    </View>
  );
};

export default ScheduleTimepickerIOS;
