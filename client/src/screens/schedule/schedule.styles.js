import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
  },
  headerText: {
    marginVertical: 40,
    marginHorizontal: 50,
  },
  scheduleContainer: {
    maxHeight: 750,
    borderRadius: 10,
    marginVertical: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 50,
    marginLeft: 16,
  },
  scheduleContent: {
    backgroundColor: "#fff", //"#f2f2f2",
    // height: 300,
    maxHeight: 700,
    marginHorizontal: 8,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,

    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  scheduleList: {
    maxHeight: 300,
    // height: 300,
  },
  scheduleSelector: {
    // flex: 1,
    maxHeight: 400,
    // height: 400,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scheduleTimes: {
    alignItems: "center",
    width: "100%",
  },
  timeContainer: {
    alignItems: "stretch",
    marginBottom: 40,
    width: "100%",
  },
  androidScheduler: {
    alignItems: "center",
    // marginBottom: 10,
  },
  scheduleButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  scheduleButton: {
    width: "45%",
  },
});

export default styles;
