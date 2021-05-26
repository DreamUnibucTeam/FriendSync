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

import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "@ui-kitten/components";
import moment from "moment";

import { GroupContext } from "../../context/GroupContext";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";

import styles from "./schedule.styles";

const Schedule = ({ navigation, route }) => {
  const [group, setGroup] = useContext(GroupContext);

  return (
    <View style={styles.container}>
      <Text>{group.meeting ? group.meeting.id : "No id"}</Text>
      <Text>{group.meeting ? group.meeting.name : "No name"}</Text>
    </View>
  );
};
export default Schedule;
