import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#fff",
    // justifyContent: "center",
  },
  main: {
    marginTop: 50,
    width: "100%",
  },
  input: {
    marginTop: 64,
    marginHorizontal: 32,
    marginBottom: 23,
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
    // borderBottomColor: "#8e93a1",
    // borderBottomWidth: 0.5,
    height: 60,
    marginTop: 10,
  },
  labels: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  label: {
    backgroundColor: "#f2f2f2",
    alignContent: "center",
    height: 40,
    margin: 5,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 11,
    flexDirection: "row",
  },
  removeLabel: {
    paddingLeft: 5,
    paddingTop: 2,
  },
  loading: {
    color: "#fff",
    width: 12,
  },
});

export default styles;
