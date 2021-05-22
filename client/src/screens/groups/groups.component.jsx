import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar.component";
import { useIsFocused } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { useHttp } from "../../hooks/http.hook";
import { UserContext } from "../../context/UserContext";
import { GroupContext } from "../../context/GroupContext";
import { auth } from "../../firebase/firebase";
import Spinner from "react-native-loading-spinner-overlay";
import CustomText from "../../components/customText/customText.component";
import LoadingPage from "../../components/loading-page/loading-page.component";

import { setIntervalAsync } from "set-interval-async/fixed";
import { clearIntervalAsync } from "set-interval-async";

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
import { MaterialIcons } from "@expo/vector-icons";

const Groups = ({ navigation }) => {
  const { request, loading, REST_API_LINK, error } = useHttp();
  const [firstLoading, setFirstLoading] = useState(true);
  const [groupList, setGroupList] = useState();
  const [user, setUser] = useContext(UserContext);
  const [group, setGroup] = useContext(GroupContext);
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   const interval = setIntervalAsync(getGroups, 5000);
  //   return () => clearIntervalAsync(interval);
  // }, []);

  useEffect(() => {
    isFocused && getGroups();
  }, [isFocused]);

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
      setFirstLoading(false);
    } catch (error) {
      console.log("Error @GroupsComponent/getGroups: ", error.message);
    }
  }, [request]);

  useEffect(() => {
    isFocused &&
      setGroup({
        userUid: null,
        name: "",
        id: null,
        owner: null,
        groupPhotoUrl: "default",
      });
    isFocused && getGroups();
  }, [getGroups, isFocused]);

  // groupId, name
  const renderGroupItem = ({ item }) => (
    <Card
      onPress={() => {
        setGroup({
          userUid: auth.currentUser.uid,
          id: item.groupId,
          name: item.name,
          groupPhotoUrl: item.groupPhotoUrl,
          owner: item.owner,
        });
        navigation.navigate("ChatStack", {
          screen: "Chat",
          params: {
            id: item.groupId,
            groupName: item.name,
            groupPhotoUrl: item.groupPhotoUrl,
          },
        });
      }}
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

  return (
    <>
      <FocusAwareStatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={Platform.OS === "android" ? "#000" : ""}
      />
      {firstLoading ? (
        <LoadingPage />
      ) : (
        <Container>
          {JSON.stringify(groupList) === JSON.stringify([]) ? (
            <View style={groupsStyles.noGroups}>
              <MaterialIcons name="group-add" size={100} color="black" />
              <CustomText bold large center>
                You are not part of any groups yet
              </CustomText>
              <CustomText center>
                Tap the + icon to create a new group or wait until someone add's
                you to a group
              </CustomText>
            </View>
          ) : (
            <FlatList
              data={groupList}
              keyExtractor={(item) => item.groupId}
              renderItem={renderGroupItem}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default Groups;
