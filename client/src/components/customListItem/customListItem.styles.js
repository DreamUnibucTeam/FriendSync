import { StyleSheet, Platform } from "react-native";
import styled from "styled-components";

export const Card = styled.TouchableOpacity`
  width: 100%;
`;

export const ItemInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ItemImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
  padding-right: 10px;
  padding-left: 20px;
`;

export const ItemImg = styled.Image`
  width: 35px;
  height: 35px;
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

export const ItemInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const ItemName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #666;
`;

export const MessageText = styled.Text`
  font-size: 14px;
  color: #333333;
`;
