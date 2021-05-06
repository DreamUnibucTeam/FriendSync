import React, {useContext} from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { UserContext } from '../context/UserContext'

import AuthStackScreens from './AuthStackScreens'
import MainStackScreens from './MainStackScreens'


const AppStackScreens = () => {
    const AppStack = createStackNavigator();
    const [user] = useContext(UserContext)

    return (
        <AppStack.Navigator headerMode="none">
            {user.isLogedIn ? (
                <AppStack.Screen name="Main" component={MainStackScreens} />
            ) : (
                <AppStack.Screen name="Auth" component={AuthStackScreens} />
            )}
            
        </AppStack.Navigator>
    );
};

export default AppStackScreens;