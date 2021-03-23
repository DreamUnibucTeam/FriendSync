import React from 'react'

import { Text, View } from 'react-native'

import groupsStyles from './groups.styles'
import groupsData from './groups.data'

import Group from '../../components/group/group.component'

class Groups extends React.Component{
    
    constructor() {
        super()

        this.state = {
            groups: groupsData
        }
    }

    render() {

        return (
            <View style = {groupsStyles.container}>
                {
                    this.state.groups.map(({id, groupName, numberOfMembers}) => (
                        <Group 
                            key = {id}
                            groupName = {groupName}
                            numberOfMembers = {numberOfMembers}
                        />
                    ))
                }
            
            </View>
        )
    }
}

export default Groups