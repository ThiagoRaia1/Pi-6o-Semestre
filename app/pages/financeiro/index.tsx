import { View, Text } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import MenuButton from "../../components/TopBarMenuOption";

export default function Financeiro() {
  const globalStyles = getGlobalStyles();
  const dropdownOptions = ["Aluno", "Instrutor", "Usuário"];

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarMainMenuOptionsContainer}>
        <MenuButton label="Registrar" options={dropdownOptions} />
        <MenuButton label="Editar" options={dropdownOptions} />
        <MenuButton label="Pesquisar" options={dropdownOptions} />
        <MenuButton label="Excluir" options={dropdownOptions} />
      </View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Financeiro</Text>
      </View>
    </View>
  );
}
