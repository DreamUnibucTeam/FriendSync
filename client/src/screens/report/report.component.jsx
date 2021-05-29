import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  Input,
  Autocomplete,
  AutocompleteItem,
  Button,
} from "@ui-kitten/components";
import CustomText from "../../components/customText/customText.component";
import { AntDesign } from "@expo/vector-icons";

import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import styles from "./report.styles";
import defaultLabels from "./report.data";

const Report = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [labels, setLabels] = useState([]);
  const [dataLabels, setDataLabels] = useState(defaultLabels);
  const { request, loading, error, REST_API_LINK } = useHttp();

  const createReport = async () => {
    try {
      const uid = auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();
      const response = await request(
        `${REST_API_LINK}/api/report/bug`,
        "POST",
        {
          title,
          body,
          labels,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      Alert.alert("Success", response.message);
      setLabels([]);
      setTitle("");
      setBody("");
    } catch (error) {
      console.log("Error @Report/createReport: ", error.message);
      Alert.alert("Error", error.message);
    }
  };

  /* Input functions */
  const filter = (item, query) =>
    item.toLowerCase().includes(query.toLowerCase());

  const onSelect = (index) => {
    setLabelValue(dataLabels[index]);
  };

  const removeLabel = (index) => {
    const newLabels = [...labels];
    newLabels.splice(index, 1);
    setLabels(newLabels);
  };

  const renderLabel = (label, index) => (
    <View key={index} style={styles.label}>
      <Text>{label}</Text>
      <AntDesign
        name="closecircle"
        size={15}
        color="black"
        style={styles.removeLabel}
        onPress={() => removeLabel(index)}
      />
    </View>
  );

  const renderAutocompleteLabel = (label, index) => (
    <AutocompleteItem key={index} title={label} />
  );

  const onChangeLabel = (query) => {
    setLabelValue(query);
    setDataLabels(defaultLabels.filter((label) => filter(label, query)));
  };

  const onSubmitLabel = (event) => {
    setLabels([...labels, labelValue]);
    setLabelValue("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      // keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container}>
        <View style={styles.main}>
          <CustomText center title>
            Report a bug
          </CustomText>

          <View style={styles.input}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Title</Text>
              <Input
                placeholder="Give a name to the bug"
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(title) => setTitle(title)}
                value={title}
              />
            </View>

            <View style={{ marginBottom: 60 }}>
              <Text style={styles.inputTitle}>Description</Text>
              <Input
                placeholder="Describe the bug that you want to report"
                textStyle={{ minHeight: 64 }}
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(body) => setBody(body)}
                value={body}
                multiline={true}
              />
            </View>

            <View style={{ marginBottom: 60 }}>
              <Text style={styles.inputTitle}>Labels</Text>
              <Autocomplete
                placeholder="Add labels to this report"
                style={styles.inputField}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={onChangeLabel}
                value={labelValue}
                onSubmitEditing={onSubmitLabel}
              >
                {
                  // defaultLabels.map(renderAutocompleteLabel)
                }
              </Autocomplete>
              <View style={styles.labels}>
                {labels.map((label, index) => renderLabel(label, index))}
              </View>
            </View>

            <Button status="danger" onPress={async () => await createReport()}>
              {loading ? (
                <ActivityIndicator color="#fff" style={styles.loading} />
              ) : (
                "Report bug"
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Report;
