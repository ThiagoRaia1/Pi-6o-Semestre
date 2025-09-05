import { View, Text, TouchableOpacity } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";

export default function Agenda() {
  const globalStyles = getGlobalStyles();

  return (
    <View style={globalStyles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Agenda</Text>
      </View>
    </View>
  );
}
