import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView
  } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import CustomText from "../../components/customText/customText.component";

import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { UserContext } from "../../context/UserContext";
import styles from "./profile.styles";
import Report from "../report/report.component";

const Profile = () => {

  return (
  <ScrollView style={styles.container}>
    <View style={styles.userInfo}>
      <View style={styles.profilePhotoContainer}/>
      <Text style={styles.userName}>
        Nicu Ducal
      </Text>
      <Text style={styles.email}>
        nicu@test.com
      </Text>
    </View>
    <View style={styles.statsContainer}>
      <View style={styles.statsItem}>
        <View style={styles.statsGroup}>
        <AntDesign name="heart" size={24} color="#ff0066" />
          <Text style={styles.statsText}> Friends </Text>
        </View>
        <Text style={styles.statsText}> 10 </Text>
      </View>
      <View style={styles.statsItem}>
        <View style={styles.statsGroup}>
          <AntDesign name="team" size={24} color="#8022d9" />
          <Text style={styles.statsText}> Groups </Text>
        </View>
        <Text style={styles.statsText}> 15 </Text>
      </View>
      <View style={styles.statsItem}>
        <View style={styles.statsGroup}>
          <AntDesign name="calendar" size={24} color="#23a6d5" />
          <Text style={styles.statsText}> Meets </Text>
        </View>
        <Text style={styles.statsText}> 5 </Text>
      </View>
      <View style={styles.statsItem}>
        <View style={styles.statsGroup}>
          <AntDesign name="dashboard" size={24} color="#00cc99" />
          <Text style={styles.statsText}> Overall Score </Text>
        </View>
        <Text style={styles.statsText}> 50 </Text>
      </View>
    </View>
    <TouchableOpacity style={styles.reportBugButton} 
      // onPress={() => {
      //   navigation.navigate("ProfileStack", {
      //     screen: "Report",
      //   });
      // }}
    >
      <Text style={styles.bugText}>Report a bug</Text>
    </TouchableOpacity>
  </ScrollView>
  );
};

export default Profile;