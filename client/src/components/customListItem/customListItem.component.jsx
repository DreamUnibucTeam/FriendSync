import React from 'react'
import {Text} from 'react-native'

import {
    Card,
    ItemInfo,
    ItemImgWrapper,
    ItemImg,
    ItemInfoText,
    ItemName,
    PostTime,
    MessageText,
    TextSection,
  } from "./customListItem.styles";

const CustomListItem = (props) => {
    return (
        <Card
      onPress={props.onPress}
    >
      <ItemInfo>
        <ItemImgWrapper>
          <ItemImg
            source={{
              uri: props.photoUrl,
            }}
          />
        </ItemImgWrapper>
        <TextSection>
          <ItemInfoText>
            <ItemName>{props.name}</ItemName>
            {
              //<PostTime>4 am</PostTime>
            }
          </ItemInfoText>
          {
            //<MessageText>Hellow</MessageText>
          }
        </TextSection>
      </ItemInfo>
    </Card>
    )
}

export default CustomListItem