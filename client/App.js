import React from "react";
import "react-native-gesture-handler";

import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppStackScreens from "./src/stacks/AppStackScreens";
import { UserProvider } from "./src/context/UserContext";
import { FirebaseProvider } from "./src/context/FirebaseContext";

const App = () => {
  const Stack = createStackNavigator();

  LogBox.ignoreLogs(["Setting a timer"]);

  return (
    <FirebaseProvider>
      <UserProvider>
        <NavigationContainer>
          <AppStackScreens />
        </NavigationContainer>
      </UserProvider>
    </FirebaseProvider>
  );
};

export default App;
