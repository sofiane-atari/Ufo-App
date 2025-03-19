import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  map: {
    flex: 1,
  },
  formContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  toggleButton: {
    position: "absolute",
    left: 10,
    bottom: "50%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1010,
  },
  warning: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    color: "red",
  },
  cameracontainer: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    marginTop: 128,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "purple",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});

export default styles;
