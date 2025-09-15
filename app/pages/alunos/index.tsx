import { View, Text } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import MenuButton from "../../components/MenuButton";

export default function Alunos() {
  const globalStyles = getGlobalStyles();

  const onPressListar = () => {
    console.log("Listar")
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarMainMenuOptionsContainer}>
        <MenuButton label="Listar" onPress={onPressListar} />
        <MenuButton label="Placeholder" />
        <MenuButton label="Placeholder" />
      </View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Alunos</Text>
      </View>
    </View>
  );
}
