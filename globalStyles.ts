import { StyleSheet } from "react-native";
import { colors } from "./utils/colors";

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
      paddingVertical: 16,
      paddingHorizontal: 64,
    },
    topBarMainMenuOptionsContainer: {
      width: "100%",
      minHeight: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      zIndex: 9,
    },
    topBarSubMenuOptionsContainer: {
      width: "100%",
      minHeight: 60,
      backgroundColor: colors.buttonMainColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 10,
      zIndex: 8,
    },
  });
