import { View, Text } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import MenuButton from "../../components/MenuButton";

export default function Equipe() {
  const globalStyles = getGlobalStyles();
  const dropdownOptions = ["Aluno", "Instrutor", "Usuário"];

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarSubMenuOptionsContainer}></View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Equipe</Text>
      </View>
    </View>
  );
}
