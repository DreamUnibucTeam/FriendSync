import { StyleSheet, Platform } from "react-native";
import styled from "styled-components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  main: {
    marginTop: 50,
    width: "100%",
  },
  groupPhotoContainer: {
    backgroundColor: "#e1e2e6",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginTop: 16,
    overflow: "hidden",
  },
  groupPhoto: {
    flex: 1,
  },
  defaultGroupPhoto: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
    borderBottomColor: "#8e93a1",
    borderBottomWidth: 0.5,
    height: 48,
  },
  submitContainer: {
    marginHorizontal: 32,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00cc00",
    borderRadius: 6,
  },
  loading: {
    color: "#fff",
    width: 34,
  },
});

export default styles;
