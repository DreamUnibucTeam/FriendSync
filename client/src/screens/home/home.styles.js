import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerGraphic: {
    position: "absolute",
    width: "100%",
    top: -50,
    zIndex: -100,
  },
  rightCircle: {
    backgroundColor: "#8022d9",
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    right: -100,
    top: -200,
  },
  leftCircle: {
    backgroundColor: "#23a6d5",
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    left: -50,
    top: -50,
  },
  headerContainer: {
    height: 70,
    marginTop: 90,
    marginLeft: 16,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: -0.41,
    lineHeight: 41,
  },
  mainComponent: {
    backgroundColor: "blue",
    height: 350,
    maxHeight: 350,
  },
  actionButtons: {
    margin: 2,
  },
  listItem: {
    backgroundColor: "#f2f2f2",
  },
  loading: {
    justifyContent: "center",
    color: "#fff",
    width: 34,
  },
});

export default styles;
