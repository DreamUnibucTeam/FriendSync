import { StyleSheet } from 'react-native'

const signInScreenStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        marginTop: 192
    },
    auth: {
        margin: '64px 32px 23px'
    },
    authContainer: {
        marginBottom: 32
    },
    authTitle: {
        color: '#8e93a1',
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: "300"
    },
    authField: {
        borderBottomColor: '#8e93a1',
        borderBottomWidth: 0.5,
        height: 48
    },
    signInContainer: {
        margin: '0 32px',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8022d8',
        borderRadius: 6

    },
    loading: {
        color: '#fff',
        width: 34
    },
    signUp: {
        marginTop: 16
    },
    headerGraphic: {
        position: 'absolute',
        width: '100%',
        top: -50,
        zIndex: -100
    },
    rightCircle: {
        backgroundColor: '#8022d9',
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        right: -100,
        top: -200
    },
    leftCircle: {
        backgroundColor: '#23a6d5',
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        left: -50,
        top: -50
    }
})

export default signInScreenStyles