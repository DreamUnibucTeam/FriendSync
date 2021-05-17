import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
} from "react-native";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useHttp } from "../../hooks/http.hook";
import { UserContext } from "../../context/UserContext";
import { auth } from "../../firebase/firebase";
import Spinner from "react-native-loading-spinner-overlay";

import groupsStyles, {
  Container,
  Card,
  GroupInfo,
  GroupImgWrapper,
  GroupImg,
  GroupInfoText,
  GroupName,
  PostTime,
  MessageText,
  TextSection,
} from "./groups.styles";
import groupsData from "./groups.data";

import Group from "../../components/group/group.component";
import groupStyles from "../../components/group/group.styles";

const Groups = ({ navigation }) => {
  const { request, loading, REST_API_LINK, error } = useHttp();
  const [groupList, setGroupList] = useState();
  const [user, setUser] = useContext(UserContext);
  const isFocused = useIsFocused();

  const createGroup = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const data = await request(
        `${REST_API_LINK}/api/groups/group`,
        "POST",
        {
          uid: user.uid,
          name: "Test Add Grup",
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      await getGroups();
    } catch (error) {
      console.log("Error @GroupsComponent/createGroup: ", error.message);
    }
  };

  const getGroups = useCallback(async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const data = await request(
        `${REST_API_LINK}/api/users/belongsTo/groups/${user.uid}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      // console.log(data.groups);
      setGroupList(data.groups);
    } catch (error) {
      console.log("Error @GroupsComponent/getGroups: ", error.message);
    }
  }, [request]);

  useEffect(() => {
    isFocused && getGroups();
  }, [getGroups, isFocused]);

  // groupId, name
  const renderGroupItem = ({ item }) => (
    <Card
      onPress={() =>
        navigation.navigate("ChatStack", {
          screen: "Chat",
          params: {
            id: item.groupId,
            groupName: item.name,
            groupPhotoUrl: item.groupPhotoUrl,
          },
        })
      }
    >
      <GroupInfo>
        <GroupImgWrapper>
          <GroupImg
            source={{
              uri: item.groupPhotoUrl,
            }}
          ></GroupImg>
        </GroupImgWrapper>
        <TextSection>
          <GroupInfoText>
            <GroupName>{item.name}</GroupName>
            {
              //<PostTime>4 am</PostTime>
            }
          </GroupInfoText>
          {
            //<MessageText>Hellow</MessageText>
          }
        </TextSection>
      </GroupInfo>
    </Card>
  );

  // if (true) {
  //   return <Loader />;
  // }

  return (
    <>
      <FocusAwareStatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={Platform.OS === "android" ? "#000" : ""}
      />
      <Spinner
        visible={loading}
        textContent={"Loading groups..."}
        textStyle={{ color: "#fff" }}
      />
      <Container>
        <FlatList
          data={groupList}
          keyExtractor={(item) => item.groupId}
          renderItem={(item) => renderGroupItem(item)}
        />
      </Container>
    </>
  );
};

export default Groups;

{
  //   <View style={groupsStyles.header}>
  //   <Text> </Text>
  //   <View style={groupsStyles.search}>
  //     <TextInput style={groupsStyles.searchInput} />
  //     <Icon
  //       style={groupsStyles.searchIcon}
  //       name="search"
  //       type="font-awesome"
  //     />
  //   </View>
  //   <Icon
  //     style={groupsStyles.createGroup}
  //     name="plus"
  //     type="font-awesome"
  //     onPress={createGroup}
  //   />
  // </View>
  // <View style={groupsStyles.groupList}>
  //   {groupList.map(({ groupId, name }) => (
  //     <TouchableOpacity
  //       key={groupId}
  //       onPress={() =>
  //         navigation.navigate("ChatStack", {
  //           screen: "Chat",
  //           params: {
  //             id: groupId,
  //             groupName: name,
  //             groupPhotoUrl: user.profilePhotoUrl,
  //           },
  //         })
  //       }
  //     >
  //       <Group
  //         key={groupId}
  //         groupName={name}
  //         groupPhotoUrl={user.profilePhotoUrl}
  //         lastMessage="IDK"
  //       />
  //       <Text>{groupId}</Text>
  //     </TouchableOpacity>
  //   ))}
  // </View>
}
