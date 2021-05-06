import React, {useState} from 'react'
import {ScrollView, Text, StatusBar, ActivityIndicator, TextInput, View, Keyboard, TouchableWithoutFeedback, Platform, TouchableOpacity, Image } from 'react-native'
import { AntDesign } from "@expo/vector-icons"

import styles from '../styles/authScreens.styles'
import CustomText from '../../../components/customText/customText.component'

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState("")
    const [profilePhoto, setProfilePhoto] = useState()

    const getPermission = async () => {
        if (Platform.OS != "web") {
            const { status } = await MediaLibrary.requestPermissionsAsync()
            return status;
        }
    }


    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLIbraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            })

            if(!result.cancelled) {
                setProfilePhoto(result.uri)
            }
        } catch (error) {
            console.log("Error @pickImage: ", error.message)
        }
    }

    const addProfilePhoto = async () => {
        const status = await getPermission()

        if(status !== "granted") {
            alert("We need permission to access your camera roll")
            return
        }
        pickImage()
    }


    return (
        <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
                <View style={styles.container}>
                    <View style={styles.main}>
                        <CustomText title semi center>
                            Sign Up to get started
                        </CustomText>
                    </View>

                    <TouchableOpacity style={styles.profilePhotoContainer} onPress={addProfilePhoto}>
                        {profilePhoto ? (
                            <Image
                                style={styles.profilePhoto} 
                                source={{ uri: profliePhoto}}
                            />
                        ): (
                            <View style={styles.defaultProfilePhoto}>
                                <AntDesign 
                                    name="plus"
                                    size={24}
                                    color="#fff"
                                />
                            </View>
                        )}

                    </TouchableOpacity>

                    <View style={styles.auth}>
                        <View style={styles.authContainer}>
                            <Text style={styles.authTitle}>Username</Text>
                            <TextInput 
                                style={styles.authField}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(username) => setUsername(username.trim())}
                                value={username}
                            />
                        </View>
                        <View style={styles.authContainer}>
                            <Text style={styles.authTitle}>Email Address</Text>
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
                        <View style={styles.authContainer}>
                            <Text style={styles.authTitle}>Password</Text>
                            <TextInput 
                                style={styles.authField}
                                autoCapitalize="none"
                                autoCompleteType="password"
                                autoCorrect={false}
                                secureTextEntry={true}
                                onChangeText={(password) => setPassword(password.trim())}
                                value={password}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.signContainer} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator style={styles.loading} />
                        ) : (
                            <CustomText bold center color="#fff">
                                Sign Up
                            </CustomText>
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.sign} onPress={() => navigation.navigate("Sign In")}>
                        <CustomText small center>
                            Already have an account?{" "}
                            <CustomText bold color="#8022d9" >
                                Sign In
                            </CustomText>
                        </CustomText>
                        

                    </TouchableOpacity>
                    
                    <View style={styles.headerGraphic}>
                        <View style={styles.rightCircle}/>
                        <View style={styles.leftCircle} />
                    </View>
                    <StatusBar barStyle='light-content' />

                </View>

            </TouchableWithoutFeedback>

        </ScrollView>
        
    )

}


export default SignUpScreen
