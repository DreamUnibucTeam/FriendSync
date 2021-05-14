import React, { useState } from "react";

import { Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

import groupsStyles from "./groups.styles";
import groupsData from "./groups.data";

import Group from "../../components/group/group.component";
import GroupStackScreens from '../../stacks/GroupStackScreens'

const Groups = ({navigation}) => {
  const [groupList, setGroupList] = useState(groupsData)
  return (
    <ScrollView style={groupsStyles.container}>
      <View
        style ={groupsStyles.header}>
        <Text>{" "}</Text>
        
        <View style={groupsStyles.search}>
          <TextInput style={groupsStyles.searchInput} />
          <Icon
            style={groupsStyles.searchIcon}
            name="search"
            type="font-awesome"
          />
        </View>
        <Icon
          style={groupsStyles.createGroup}
          name="plus"
          type="font-awesome"
        />
      </View>

      <View style={groupsStyles.groupList}>
        {groupList.map(
          ({ id, groupName, groupPhotoUrl, lastMessage }) => (
            <TouchableOpacity
              onPress={GroupStackScreens}
              key={id}
            >
              <Group
                
                groupName={"groupName"}
                groupPhotoUrl={groupPhotoUrl}
                lastMessage={"lastMessage"}
              />
            </TouchableOpacity>
          )
        )}
      </View>
    </ScrollView>
  );
}

export default Groups;
