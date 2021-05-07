import React, { useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { auth } from "../../firebase/firebase";
import { useHttp } from "../../hooks/http.hook";
import { FirebaseContext } from "../../context/FirebaseContext";

import homeStyles from "./home.styles";

const Home = ({ navigation }) => {
  const { request, REST_API_LINK } = useHttp();
  const Firebase = React.useContext(FirebaseContext);

  const makeRequest = useCallback(async () => {
    try {
      const token = await Firebase.getCurrentUserToken();

      const data = await request(
        `${REST_API_LINK}/api/auth/test`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(data);
    } catch (error) {
      console.log("Error @makeRequest: ", error.message);
    }
  }, []);

  return (
    <View style={homeStyles.container}>
      <Text>Home Component</Text>
      <View>
        <Text>{auth.currentUser.uid}</Text>
        <Text>{auth.currentUser.displayName}</Text>
        <Text>{auth.currentUser.email}</Text>
      </View>
      <TouchableOpacity
        style={{
          marginHorizontal: 32,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#8022d8",
          borderRadius: 6,
        }}
        onPress={() => auth.signOut()}
      >
        <Text>Sign out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 50,
          marginHorizontal: 32,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#8022d8",
          borderRadius: 6,
        }}
        onPress={makeRequest}
      >
        <Text>Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
