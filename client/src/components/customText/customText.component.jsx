import React from 'react'
import { Text } from 'react-native'

const CustomText = ({...props}) => {



    return (
        <Text>
            {props.text}
        </Text>
    )
}

export default CustomText