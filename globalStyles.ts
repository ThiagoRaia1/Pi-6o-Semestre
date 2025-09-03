import { StyleSheet } from "react-native";

export const getGlobalStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 0,
    },
    mainContent: {
      flex: 1,
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      backgroundColor: "#eee",
      zIndex: 1,
    },
    topBarMainMenuOptionsContainer: {
      width: "100%",
      backgroundColor: "#89B6D5",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 10,
      zIndex: 8,
    },
    topBarMainMenuOptionsButton: {
      flexDirection: "row",
      minWidth: 250,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      gap: 5,
      borderRadius: 10,
      backgroundColor: "#4086DC",
      zIndex: 10,
    },
    topBarMainMenuOptionsButtonText: {
      color: "white",
      fontWeight: 600,
    },
  });
