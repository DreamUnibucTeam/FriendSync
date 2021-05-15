import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Chat from '../screens/chat/chat.component'
import Map from '../screens/map/map.component'
import Groups from '../screens/groups/groups.component'
import ChatStackScreens from './ChatStack'

const GroupStackScreens = () => {
  const GroupStack = createStackNavigator();

  return (
    <GroupStack.Navigator headerMode='none'>
      <GroupStack.Screen 
        name="Groups" 
        component={Groups} 
        options={() => ({
          headerShown:false
        })}
      />
      <GroupStack.Screen 
        name="ChatStack" 
        component={ChatStackScreens} 
        options={({route}) => ({
          title: route.params.params.groupName,
          headerBackTitleVisible: false
        })}
      />
      <GroupStack.Screen name="Map" component={Map} />
    </GroupStack.Navigator>
  );
};

export default GroupStackScreens;
