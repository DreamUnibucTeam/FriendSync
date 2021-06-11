import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FocusAwareStatusBar from "../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import Report from "../screens/report/report.component";
import Profile from "../screens/profile/profile.component";

const ProfileStackScreens = ({ navigation }) => {
  const ProfileStack = createStackNavigator();

  return (
    <ProfileStack.Navigator headerMode="float">
      <ProfileStack.Screen
      name="Profile"
      component={Profile}
      />
      <ProfileStack.Screen
        name="Report"
        component={Report}
        options={{
          headerTitle: "Report",
        }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreens;
