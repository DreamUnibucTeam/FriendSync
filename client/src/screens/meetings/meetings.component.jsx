import React from 'react'
import {SafeAreaView, Text, FlatList, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import CustomListItem from "../../components/customListItem/customListItem.component"

const meetingList = [
    {
        meetingId: 0,
        meetingName: "meet 0",
    },
    {
        meetingId: 1,
        meetingName: "meet 1",
    },
    {
        meetingId: 2,
        meetingName: "meet 2",
    },
    {
        meetingId: 3,
        meetingName: "meet 3",
    },
    {
        meetingId: 4,
        meetingName: "meet 0",
    },
    {
        meetingId: 5,
        meetingName: "meet 1",
    },
    {
        meetingId: 6,
        meetingName: "meet 2",
    },
    {
        meetingId: 7,
        meetingName: "meet 3",
    },
]

const Meetings = ({ navigation }) => {

    return (

        <SafeAreaView>
            <FlatList 
                data={meetingList}
                keyExtractor = {(item) => item.meetingId}
                renderItem = {({item}) => (
                    <CustomListItem
                        name={item.meetingName}
                        onPress={() => {
                            navigation.navigate("Groups", {
                                screen: "MeetingStack",
                                params: {
                                    id: item.meetingId,
                                    meetingName: item.meetingName,
                                }
                            })
                        }}

                    />
                )}
            />
        </SafeAreaView>
    )
    

}

export default Meetings