import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { auth } from "../../../firebase/firebase";

import styles from "../styles/authScreens.styles";
import CustomText from "../../../components/customText/customText.component";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Error @signIn: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
        <View style={styles.container}>
          <View style={styles.main}>
            <CustomText title semi center>
              FriendSync
            </CustomText>
          </View>

          <View style={styles.auth}>
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
            onPress={signIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator style={styles.loading} />
            ) : (
              <CustomText bold center color="#fff">
                Sign In
              </CustomText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sign}
            onPress={() => navigation.navigate("SignUp")}
          >
            <CustomText small center>
              New to FriendSync?{" "}
              <CustomText bold color="#8022d9">
                Sign Up
              </CustomText>
            </CustomText>
          </TouchableOpacity>

          {
            /* Temp */
            // <TouchableOpacity
            //   style={styles.signContainer}
            //   onPress={() => auth.signOut()}
            //   disabled={loading}
            // >
            //   {loading ? (
            //     <ActivityIndicator style={styles.loading} />
            //   ) : (
            //     <CustomText bold center color="#fff">
            //       Sign Out
            //     </CustomText>
            //   )}
            // </TouchableOpacity>
          }

          <View style={styles.headerGraphic}>
            <View style={styles.rightCircle} />
            <View style={styles.leftCircle} />
          </View>
          <StatusBar barStyle="light-content" />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default SignInScreen;
