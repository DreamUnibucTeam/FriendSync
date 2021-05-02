import React from 'react'

import { Text, View, TextInput } from 'react-native'
import { Icon } from 'react-native-elements'

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

                <View> style = {groupsStyles.header}
                    <View style = {groupsStyles.search}>
                        <TextInput style = {groupsStyles.searchInput} 


                        />
                        <Icon 
                            style={groupsStyles.searchIcon}
                            name='search'
                            type='font-awesome'
                        />
                    </View>

                    <Icon 
                        style={groupsStyles.createGroup}
                        name='plus'
                        type='font-awesome'
                    />

                </View>

                <View style={groupsStyles.groupList}>
                {
                    this.state.groups.map(({id, groupName, groupPhotoUrl, lastMessage}) => (
                        <Group 
                            key = {id}
                            groupName = {groupName}
                            groupPhotoUrl = {groupPhotoUrl}
                            lastMessage = {lastMessage}

                        />
                    ))
                }

                </View>

                
            
            </View>
        )
    }
}

export default Groups