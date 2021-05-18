import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import styles from "./add-friend.styles";

import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import Spinner from "react-native-loading-spinner-overlay";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { SearchBar } from "react-native-elements";

const AddFriend = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const { request, loading, error, REST_API_LINK } = useHttp();

  const getAllUsers = useCallback(async () => {
    try {
    } catch (error) {
      console.log("Error @AddFriend/getAllUsers: ", error.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={Platform.OS === "android" ? "#000" : ""}
      />
      <Spinner
        visible={loading}
        textContent={"Loading friends..."}
        textStyle={{ color: "#fff" }}
      />
      <SearchBar
        round={true}
        showCancel={true}
        containerStyle={{ backgroundColor: "#fff" }}
        inputContainerStyle={{ height: 40, marginHorizontal: 10 }}
        inputStyle={{ color: "#000" }}
        placeholder="Enter a user's name or email"
        onChangeText={(search) => setSearch(search)}
        lightTheme="true"
        value={search}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
        <View>
          <Text>Here</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AddFriend;
