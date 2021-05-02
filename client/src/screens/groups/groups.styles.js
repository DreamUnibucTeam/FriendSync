import { StyleSheet } from 'react-native'

const groupsStyles = StyleSheet.create({
    container: {
      backgroundColor: '#3e3e3e',
    },

    header: {
      display: 'flex',

      flexDirection: 'row',
      margin: 10,
      width: 40
    },

    search: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'grey',
      padding: 15,
      borderRadius: 5,
    },

    searchInput: {
      backgroundColor: 'grey',
    },

    searchIcon: {
      padding: 5,
      height: 20,
    },

    createGroup: {
      marginLeft: 10,
      backgroundColor: 'grey',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 50,
      width: 50,
      height: 50,
    },

    groupList: {
      display: 'flex',
      flexDirection: 'column',
      width: 700
    }
  })

  export default groupsStyles