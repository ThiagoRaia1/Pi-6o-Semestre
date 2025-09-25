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
    },
    topBarMainMenuOptionsContainer: {
      width: "100%",
      minHeight: 60,
      backgroundColor: colors.main,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 10,
      zIndex: 9,
      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.6)",
    },
    topBarSubMenuOptionsContainer: {
      width: "100%",
      minHeight: 60,
      backgroundColor: colors.topBarColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 10,
      zIndex: 8,
    },
  });
