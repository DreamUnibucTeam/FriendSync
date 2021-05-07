import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { auth } from "../../firebase/firebase";

import homeStyles from "./home.styles";

const Home = ({ navigation }) => (
  <View style={homeStyles.container}>
    <Text>Home Component</Text>
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
      <Text>Press Here</Text>
    </TouchableOpacity>
  </View>
);

export default Home;
