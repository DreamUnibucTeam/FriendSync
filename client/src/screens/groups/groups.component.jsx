import React, { useCallback, useEffect, useState, useContext } from "react";

import { Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import {useHttp} from "../../hooks/http.hook"
import {UserContext} from '../../context/UserContext'
import {auth} from '../../firebase/firebase'

import groupsStyles from "./groups.styles";
import groupsData from "./groups.data";

import Group from "../../components/group/group.component";

const Groups = ({navigation}) => {
  const { request, loading, REST_API_LINK, error } = useHttp()
  const [groupList, setGroupList] = useState(groupsData)
  const [user, setUser] = useContext(UserContext)

  const getGroups = useCallback(async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const data = await request(`${REST_API_LINK}/api/users/belongsTo/groups/${user.uid}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setGroupList(data)
      console.log(data)
    } catch (error) {
      console.log("Error @GroupsComponent/getGroups: ", error.message)
    }
  }, [request])

  useEffect(() => {
    getGroups()
  }, [getGroups])

  // groupId, name

  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }

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
          ({ groupId, name }) => (
            <TouchableOpacity
              onPress={() =>navigation.navigate("ChatStack", {
                screen: 'Chat',
                params: {
                  id:groupId, 
                  groupName:name, 
                  groupPhotoUrl:user.profilePhotoUrl,
                }
              })}
              key={groupId}
            >
              <Group
                
                groupName={name}
                groupPhotoUrl={user.profilePhotoUrl}
                lastMessage={"last message"}
              />
            </TouchableOpacity>
          )
        )}
      </View>
    </ScrollView>
  );
}

export default Groups;
