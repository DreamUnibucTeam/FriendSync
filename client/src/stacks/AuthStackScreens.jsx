import React from "react"
import {createStackNavigator} from '@react-navigation/stack'
import SignInScreen from '../screens/authScreens/signin/signInScreen.component'
import SignUpScreen from '../screens/authScreens/signup/signUpScreen.component'

const AuthStackScreens = () => {
    const AuthStack = createStackNavigator()

    return (
        <AuthStack.Navigator headerMode='none'>
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="SignIn" component={SignInScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthStackScreens