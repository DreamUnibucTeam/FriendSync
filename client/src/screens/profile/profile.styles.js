import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  main: {
    marginTop: 192,
  },
  profilePhotoContainer: {
    backgroundColor: "#e1e2e6",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginTop: 16,
    overflow: "hidden",
  },
  profilePhoto: {
    flex: 1,
  },
  userInfo: {
    marginBottom: 30,
  },
  userName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: -0.41,
    lineHeight: 41,
    paddingTop: 10,
    alignSelf: "center",
    paddingHorizontal: 50,
    textAlign: "center",
  },
  email: {
    fontSize: 15,
    alignSelf: "center",
  },
  statsContainer: {
    marginTop: 0,
    flex: 1,
    borderTopColor: "#8e93a1",
    borderTopWidth: 0.3,
    flexDirection: "column",
  },
  statsGroup: {
    flexDirection: "row",
  },
  statsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 25,
    paddingHorizontal: 30,
  },
  statsText: {
    color: "#777777",
    marginHorizontal: 20,
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 26,
  },
  reportBugButton: {
    marginVertical: 30,
    marginHorizontal: 32,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#23a6d5",
    borderRadius: 6,
  },
  bugText: {
    color: "#ffffff",
  },
});

export default styles;
