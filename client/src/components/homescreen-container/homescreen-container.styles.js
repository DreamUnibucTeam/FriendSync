import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "blue",
    maxHeight: 350,
    borderRadius: 20,
    marginVertical: 20,
  },
  containerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 50,
    marginLeft: 16,
  },
  content: {
    backgroundColor: "#f2f2f2",
    // height: 300,
    maxHeight: 300,
    marginHorizontal: 16,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,

    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
  },
});

export default styles;
