import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
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
  LogBox.ignoreLogs(["Accessing the 'state' property"]);
  LogBox.ignoreLogs([
    "Can't perform a React state update on an unmounted component",
  ]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <FirebaseProvider>
          <UserProvider>
            <NavigationContainer>
              <AppStackScreens />
            </NavigationContainer>
          </UserProvider>
        </FirebaseProvider>
      </ApplicationProvider>
    </>
  );
};

export default App;
