import { StyleSheet } from 'react-native'

const groupStyles = StyleSheet.create({
    group: {
        display: 'flex',
        margin: 10,
        padding: 5,
        display: 'flex',
        flexDirection: 'row'
    },
    info: {
        marginLeft: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    image: {
        height: 70,
        width: 70,
        borderRadius: 70,
    },
    name: {
        paddingBottom: 5,
        color: 'white',
        fontSize: 20,
    },
    message: {
        fontSize: 15,
        color: 'white'
    }
})

export default groupStyles