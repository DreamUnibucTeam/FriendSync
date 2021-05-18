import React, { useState, useContext } from "react";
import {
  ScrollView,
  Text,
  StatusBar,
  ActivityIndicator,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { FirebaseContext } from "../../../context/FirebaseContext";
import { auth } from "../../../firebase/firebase";

import styles from "../styles/authScreens.styles";
import CustomText from "../../../components/customText/customText.component";

const SignUpScreen = ({ navigation }) => {
  const Firebase = useContext(FirebaseContext);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  const [profilePhoto, setProfilePhoto] = useState();

  const getPermission = async () => {
    try {
      if (Platform.OS != "web") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status;
      }
    } catch (error) {
      console.log("Error @SignUp/getPermission: ", error.message);
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
        setProfilePhoto(result.uri);
      }
    } catch (error) {
      console.log("Error @pickImage: ", error.message);
    }
  };

  const addProfilePhoto = async () => {
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
      console.log("Error @SignUp/addProfilePhoto: ", error.message);
    }
  };

  const signUp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await Firebase.createUserProfile({
        uid: user.uid,
        displayName: displayName.trim(),
        email,
        profilePhoto: profilePhoto ? profilePhoto : "default",
      });

      setDisplayName("");
      setEmail("");
      setPassword("");
      setProfilePhoto(null);
      Alert.alert("Succes", "You have successfully signed up!");
    } catch (error) {
      console.log("Error @signUp: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
          <View style={styles.container}>
            <View style={styles.main}>
              <CustomText title semi center>
                Sign Up to get started
              </CustomText>
            </View>

            <TouchableOpacity
              style={styles.profilePhotoContainer}
              onPress={addProfilePhoto}
            >
              {profilePhoto ? (
                <Image
                  style={styles.profilePhoto}
                  source={{ uri: profilePhoto }}
                />
              ) : (
                <View style={styles.defaultProfilePhoto}>
                  <AntDesign name="plus" size={24} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.auth}>
              <View style={styles.authContainer}>
                <Text style={styles.authTitle}>Name</Text>
                <TextInput
                  style={styles.authField}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(displayName) => setDisplayName(displayName)}
                  value={displayName}
                />
              </View>
              <View style={styles.authContainer}>
                <Text style={styles.authTitle}>Email Address</Text>
                <TextInput
                  style={styles.authField}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={(email) => setEmail(email.trim())}
                  value={email}
                />
              </View>
              <View style={styles.authContainer}>
                <Text style={styles.authTitle}>Password</Text>
                <TextInput
                  style={styles.authField}
                  autoCapitalize="none"
                  autoCompleteType="password"
                  autoCorrect={false}
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password.trim())}
                  value={password}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.signContainer}
              onPress={signUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator style={styles.loading} color="#fff" />
              ) : (
                <CustomText bold center color="#fff">
                  Sign Up
                </CustomText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sign}
              onPress={() => navigation.navigate("SignIn")}
            >
              <CustomText small center>
                Already have an account?{" "}
                <CustomText bold color="#8022d9">
                  Sign In
                </CustomText>
              </CustomText>
            </TouchableOpacity>

            <View style={styles.headerGraphic}>
              <View style={styles.rightCircle} />
              <View style={styles.leftCircle} />
            </View>
            <StatusBar barStyle="light-content" />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
