import React from "react";
import { View, Text } from "react-native";
import styles from "./add-group.styles";

import CustomText from "../../components/customText/customText.component";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";

const AddGroup = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={Platform.OS === "android" ? "#000" : ""}
      />
      <CustomText large bold>
        Add New Group
      </CustomText>
    </View>
  );
};

export default AddGroup;
