import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";

import Friends from "../screens/friends/friends.component";
import AddFriend from "../screens/add-friend/add-friend.component";
import { Button } from "react-native-elements";

const FriendsStackScreens = ({ navigation }) => {
  const FriendsStack = createStackNavigator();

  return (
    <FriendsStack.Navigator headerMode="float">
      <FriendsStack.Screen
        name="Friends"
        component={Friends}
        options={{
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("AddFriend")}
              icon={<AntDesign name="plus" size={24} color="#0066ff" />}
              type="clear"
            />
          ),
        }}
      />
      <FriendsStack.Screen
        name="AddFriend"
        component={AddFriend}
        options={({ route }) => ({
          title: "Add Friends",
          headerBackTitleVisible: false,
        })}
      />
    </FriendsStack.Navigator>
  );
};

export default FriendsStackScreens;
