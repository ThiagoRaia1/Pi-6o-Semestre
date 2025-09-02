import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import SideBarMenu from "../components/SideBarMenu";

export default function Login() {
  const globalStyles = getGlobalStyles();

  return (
    <View style={[globalStyles.container, { flexDirection: "row" }]}>
      {/* Menu lateral */}
      <SideBarMenu />

      {/* Main View */}
      {/* Fazer com que ela chame outras telas */}
      <View
        style={[globalStyles.mainContent, { backgroundColor: "#eee", flex: 4 }]}
      ></View>
    </View>
  );
}
