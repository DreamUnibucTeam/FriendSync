import React from "react";
import { View, ActivityIndicator } from "react-native";

import styles from "./loading-page.styles";

const LoadingPage = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator color="#000" style={styles.loading} />
    </View>
  );
};

export default LoadingPage;
