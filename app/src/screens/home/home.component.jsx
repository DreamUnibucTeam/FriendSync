import React from 'react'
import {Text, View} from 'react-native'

import homeStyles from './home.styles'

const Home = ({ navigation }) => (
    <View style = {homeStyles.container}>
        <Text>
            Home Component
        </Text>
    </View>
)

export default Home