import { StyleSheet } from 'react-native'
import React from "react";
import {Bubble } from 'react-native-gifted-chat'


export const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            wrapperStyle = {{
                right: {
                    backgroundColor: '#D1A319'
                },
                left: {
                    backgroundColor: 'pink'
                }
            }}
        />
        
    )
}

export const scrollToBottomComponent = () => (
    <FontAwesome name='angle-double-down' size={22} color='#333' />
)
