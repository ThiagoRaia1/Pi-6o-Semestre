import { StyleSheet } from "react-native";

export const getGlobalStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    mainContent: {
      flex: 1,
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
  });
