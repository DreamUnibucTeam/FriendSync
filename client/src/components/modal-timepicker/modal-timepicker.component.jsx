import React, { useState, useEffect } from "react";
import { View, Alert, Platform } from "react-native";
import moment from "moment";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const ModalTimepicker = ({
  showDate,
  setShowDate,
  setIsScheduled,
  setLoadingScheduleMeeting,
  meeting,
}) => {
  const { request, loading, error, REST_API_LINK } = useHttp();
  const [showTime, setShowTime] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  useEffect(() => {
    setMinDate(
      new Date(
        Math.max(moment().valueOf(), moment(meeting.startInterval).valueOf())
      )
    );
    setMaxDate(
      new Date(
        moment(meeting.endInterval)
          .subtract({
            hours: meeting.duration.hours,
            minutes: meeting.duration.minutes,
          })
          .valueOf()
      )
    );
    setSelectedDate(
      new Date(
        Math.max(moment().valueOf(), moment(meeting.startInterval).valueOf())
      )
    );
  }, []);

  const adminScheduleMeeting = async (date) => {
    setLoadingScheduleMeeting(true);
    const uid = auth.currentUser.uid;
    // console.log(date);
    const interval = [
      moment(date).valueOf(),
      moment(date)
        .add({
          hours: meeting.duration.hours,
          minutes: meeting.duration.minutes,
        })
        .valueOf(),
    ];

    try {
      const token = await auth.currentUser.getIdToken();
      const meetingId = meeting.id;
      const response = await request(
        `${REST_API_LINK}/api/meetings/meeting/setSchedule/${meetingId}`,
        "PUT",
        { interval },
        {
          Authorizaton: `Bearer ${token}`,
        }
      );
      Alert.alert("Succes", response.message);
      setIsScheduled(true);
    } catch (error) {
      console.log("Error @Schedule/adminScheduleMeeting: ", error.message);
      Alert.alert("Error", error.message);
    }
    setLoadingScheduleMeeting(false);
  };

  const handleConfirmDate = (date) => {
    setShowDate(false);
    setSelectedDate(date);
    // console.log(date);
    setTimeout(() => setShowTime(true), 1000);
  };

  const handleConfirmTime = async (date) => {
    try {
      // console.log(date);
      setShowTime(false);
      setSelectedDate(date);
      await adminScheduleMeeting(date);
    } catch (error) {
      console.log("Error @ModalTimepicker/handleConfirmTime: ", error.message);
      Alert.alert("Error", error.meessage);
    }
  };

  const hideDatePicker = () => {
    setShowDate(false);
    setShowTime(false);
    setTimeout(
      () =>
        Alert.alert(
          "Schedule Failed",
          "The meeting scheduling has been canceled"
        ),
      500
    );
  };

  return Platform.OS === "ios" ? (
    <View>
      <DateTimePickerModal
        isVisible={showDate}
        mode="date"
        minimumDate={minDate}
        maximumDate={maxDate}
        is24Hour={true}
        headerTextIOS="Select the meeting date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        date={selectedDate}
        minimumDate={minDate}
        maximumDate={maxDate}
        is24Hour={true}
        isVisible={showTime}
        mode="time"
        headerTextIOS="Select the meeting time"
        onConfirm={async (date) => await handleConfirmTime(date)}
        onCancel={hideDatePicker}
      />
    </View>
  ) : (
    <View>
      {showDate && (
        <DateTimePicker
          onTouchCancel={hideDatePicker}
          minimumDate={minDate}
          maximumDate={maxDate}
          is24Hour={true}
          value={selectedDate}
          mode="date"
          onChange={(event, date) => handleConfirmDate(date)}
          display="spinner"
        />
      )}
      {showTime && (
        <DateTimePicker
          onTouchCancel={hideDatePicker}
          minimumDate={minDate}
          maximumDate={maxDate}
          is24Hour={true}
          value={selectedDate}
          mode="time"
          onChange={async (event, date) => await handleConfirmTime(date)}
          display="spinner"
        />
      )}
    </View>
  );
};

export default ModalTimepicker;
