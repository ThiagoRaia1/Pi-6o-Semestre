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
    topBarSubMenuOptionsContainer: {
      width: "100%",
      backgroundColor: "#80acc9ff",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 10,
      zIndex: 8,
    },
  });
