import React, {useState} from 'react'
import {StatusBar, Keyboard, TouchableWithoutFeedback, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'

import styles from '../styles/authScreens.styles'

import CustomText from '../../../components/customText/customText.component'

const SignInScreen = ({navigation}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false} >
        
            <View style={styles.container}> 
                <View style={styles.main}>
                    <CustomText text="Welcome back"/>
                </View>

                <View style={styles.auth}>
                    <View style={styles.authContainer} >
                        <Text style={styles.authTitle}>
                            Email Address
                        </Text>

                        <TextInput 
                            style={styles.authField}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            onChangeText={(email) => setEmail(email.trim())}
                            value={email}
                        />
                    </View>
                    <View style={styles.authContainer} >
                        <Text style={styles.authTitle}>
                            Password
                        </Text>

                        <TextInput 
                            style={styles.authField}
                            autoCapitalize="none"
                            autoCompleteType="password"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password.trim())}
                            value={email}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.signContainer} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} />
                    ) : (
                        <CustomText text="Sign In" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.sign} onPress={() => navigation.navigate("Sign Up")}>
                    <CustomText text="New to SocialApp?" />
                    <CustomText text="Sign Up" />

                </TouchableOpacity>
                
                <View style={styles.headerGraphic}>
                    <View style={styles.rightCircle}/>
                    <View style={styles.leftCircle}/>
                </View>
                <StatusBar barStyle='light-content' />

            </View>
            
        </TouchableWithoutFeedback>

        
    )

}

export default SignInScreen