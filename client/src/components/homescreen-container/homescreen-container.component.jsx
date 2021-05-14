import React from "react";
import { View, Text } from "react-native";

import styles from "./homescreen-container.styles";

const HomescreenContainer = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>{props.title}</Text>
      <View style={styles.content}>{props.children}</View>
    </View>
  );
};

export default HomescreenContainer;
