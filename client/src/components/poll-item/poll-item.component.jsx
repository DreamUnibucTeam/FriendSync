import React from "react";
import { View, Text } from "react-native";

import styles from "./poll-item.styles";

const PollItem = ({ value }) => {
  return (
    <View style={{ ...styles.pollContainer, opacity: 1 }}>
      <Text style={styles.pollPercentage}>{`${value}%`}</Text>
      <View
        style={{
          ...styles.pollLine,
          width: `${value}%`,
        }}
      ></View>
    </View>
  );
};

export default PollItem;
