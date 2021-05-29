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
    maxHeight: 650,
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
    maxHeight: 250,
    // height: 250,
    marginBottom: 10,
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
  timePickers: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loading: {
    color: "#fff",
    width: 34,
  },
  activityList: {
    maxHeight: 250,
    // height: 250,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputTitle: {
    color: "#8e93a1",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "300",
  },
  inputField: {
    borderBottomColor: "#8e93a1",
    borderBottomWidth: 0.5,
    height: 48,
  },
  pollContainer: {
    width: "100%",
    height: 20,
  },
  pollLine: {
    width: "100%",
    height: 5,
    backgroundColor: "#3386FF",
    borderRadius: 100,
  },
  activitySelector: {
    maxHeight: 400,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  activityButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  selectButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
});

export default styles;
