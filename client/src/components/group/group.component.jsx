import React from 'react'
import {View, Text, Image} from 'react-native'

import groupStyles from './group.styles'

const Group = ({ groupName, groupPhotoUrl, lastMessage }) => {

    return (
        <View style = {groupStyles.group}>
            <Image 
                style={groupStyles.image}
                source={{
                    uri: groupPhotoUrl
                }}
            />

            <View style={groupStyles.info}>
                <Text style={groupStyles.name}>
                    {groupName}
                </Text>
                <Text style={groupStyles.message}>
                    {lastMessage}
                </Text>
            </View>

        </View>
    )

}

export default Group