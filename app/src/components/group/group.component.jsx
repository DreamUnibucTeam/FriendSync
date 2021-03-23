import React from 'react'
import {View, Text} from 'react-native'

import groupStyles from './group.styles'

const Group = ({groupName, numberOfMembers}) => (
    <View style = {groupStyles.group}>
        <Text style = {groupStyles.groupName}>
            {groupName}
        </Text>
        <Text style = {groupStyles.numberOfMembers}>
            Members: {numberOfMembers}
        </Text>
    </View>
)

export default Group