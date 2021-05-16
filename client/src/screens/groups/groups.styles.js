import { StyleSheet, Platform } from "react-native";
import styled from "styled-components";

const groupsStyles = StyleSheet.create({
  container: {
    // backgroundColor: "#3e3e3e",
    // marginTop: Platform.OS == "ios" ? 35 : 0,
  },

  header: {
    // display: "flex",
    // flexDirection: "row",
    // margin: 10,
    // width: 40,
  },

  search: {
    // display: "flex",
    // flexDirection: "row",
    // backgroundColor: "grey",
    // padding: 15,
    // borderRadius: 5,
  },

  searchInput: {
    // backgroundColor: "grey",
  },

  searchIcon: {
    // padding: 5,
    // height: 20,
  },

  createGroup: {
    // marginLeft: 10,
    // backgroundColor: "grey",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // padding: 10,
    // borderRadius: 50,
    // width: 50,
    // height: 50,
  },

  groupList: {
    // display: "flex",
    // flexDirection: "column",
    // width: 700,
  },
});

export default groupsStyles;

export const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  background-color: #ffffff;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
`;

export const GroupInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const GroupImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const GroupImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 10px;
  width: 300px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

export const GroupInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const GroupName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  font-family: "Lato-Regular";
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: "Lato-Regular";
`;

export const MessageText = styled.Text`
  font-size: 14px;
  color: #333333;
`;
