import { StyleSheet } from 'react-native'

const groupStyles = StyleSheet.create({
    group: {
        flex: 1,
        paddingTop: 22
    },
    groupName: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    numberOfMembers: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})

export default groupStyles