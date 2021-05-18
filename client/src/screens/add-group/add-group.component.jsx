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
import { AntDesign } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

import styles from "./add-group.styles";

import CustomText from "../../components/customText/customText.component";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import { FirebaseContext } from "../../context/FirebaseContext";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";

const AddGroup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const Firebase = useContext(FirebaseContext);
  const { request, loading, error, REST_API_LINK } = useHttp();

  const getPermission = async () => {
    try {
      if (Platform.OS != "web") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status;
      }
    } catch (error) {
      console.log("Error @AddGroup/getPermission: ", error.message);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setGroupPhoto(result.uri);
      }
    } catch (error) {
      console.log("Error @AddGroup/pickImage: ", error.message);
    }
  };

  const addGroupPhoto = async () => {
    try {
      const status = await getPermission();

      if (status !== "granted") {
        Alert.alert(
          "Permissions required",
          "We need permission to access your camera roll"
        );
        return;
      }
      await pickImage();
    } catch (error) {
      console.log("Error @AddGroup/addGroupPhoto: ", error.message);
    }
  };

  const createGroup = async () => {
    try {
      setLoadingSubmit(true);
      const uid = await auth.currentUser.uid;
      const token = await auth.currentUser.getIdToken();
      const groupPhotoUrl = await Firebase.uploadGroupPhoto(
        groupPhoto ? groupPhoto : "default"
      );
      const data = await request(
        `${REST_API_LINK}/api/groups/group`,
        "POST",
        {
          uid,
          name,
          groupPhotoUrl,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      Alert.alert("Success", data.message);
      setName("");
      setGroupPhoto("");
      setLoadingSubmit(false);
      navigation.navigate("Groups");
    } catch (error) {
      setLoadingSubmit(false);
      console.log("Error @AddGroup/createGroup: ", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        <FocusAwareStatusBar
          barStyle={
            Platform.OS === "android" ? "light-content" : "dark-content"
          }
          hidden={false}
          backgroundColor={Platform.OS === "android" ? "#000" : ""}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
          <View style={styles.main}>
            <TouchableOpacity
              style={styles.groupPhotoContainer}
              onPress={addGroupPhoto}
            >
              {groupPhoto ? (
                <Image style={styles.groupPhoto} source={{ uri: groupPhoto }} />
              ) : (
                <View style={styles.defaultGroupPhoto}>
                  <AntDesign name="plus" size={24} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

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
            </View>

            <TouchableOpacity
              style={styles.submitContainer}
              onPress={createGroup}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? (
                <ActivityIndicator style={styles.loading} color="#fff" />
              ) : (
                <CustomText bold center color="#fff">
                  Create
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddGroup;
