import { StyleSheet } from 'react-native'

const authScreensStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        marginTop: 192
    },
    auth: {
        marginTop: 64,
        marginHorizontal: 32,
        marginBottom: 23,
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
    signContainer: {
        marginHorizontal: 32,
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
    sign: {
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
    },
    profilePhotoContainer: {
        backgroundColor: '#e1e2e6',
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
        marginTop: 16,
        overflow: 'hidden'
    },
    profilePhoto: {
        flex: 1
    },
    defaultProfilePhoto: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
})

export default authScreensStyles