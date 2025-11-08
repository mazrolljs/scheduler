import { StyleSheet } from "react-native";
import { Colors } from "./colors";

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.Pcalight.background,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.Pcalight.background,
    padding: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.Pcalight.background,
  },

  // Buttons
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.SECONDARY,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: Colors.light.text,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: Colors.light.background,
  },
  inputText: {
    fontSize: 16,
    color: Colors.Pcalight.text,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginVertical: 10,
    backgroundColor: Colors.light.background,
    color: Colors.Pcalight.text,
    textAlignVertical: "top",
  },

  // Pickers
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: Colors.light.text,
  },
  pickerItem: {
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },

  // Text
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark.background,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.Pcalight.text,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    color: Colors.light.text,
  },

  // Cards
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    margin: 10,
    elevation: 4,
    shadowColor: Colors.dark.background,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  // Grid
  gridBox: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.text,
    justifyContent: "center",
    alignItems: "center",
  },
  gridBoxFilled: {
    backgroundColor: Colors.SECONDARY,
  },
  gridBoxEmpty: {
    backgroundColor: Colors.light.background,
  },

  // Navigation
  tabBar: {
    backgroundColor: Colors.Pcalight.background,
  },
  drawer: {
    backgroundColor: Colors.Pcalight.background,
  },
  drawerLabel: {
    color: Colors.Pcalight.text,
  },
});
