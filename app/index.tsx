import { View, StyleSheet } from "react-native";
import { getGlobalStyles } from "../globalStyles";

export default function Login() {
  const globalStyles = getGlobalStyles();

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      backgroundColor: "red",
    },
    mainContent: {
      flex: 1,
      backgroundColor: "yellow",
    },
  });

  return (
    <View style={globalStyles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.mainContent}></View>
        <View
          style={[styles.mainContent, { backgroundColor: "green", flex: 4 }]}
        ></View>
      </View>
    </View>
  );
}
