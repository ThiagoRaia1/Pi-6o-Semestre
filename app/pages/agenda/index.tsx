import { View, Text } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import MenuButton from "../../components/MenuButton";
import { router } from "expo-router";
import { pageNames } from "../../../utils/pageNames";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Agenda() {
  const globalStyles = getGlobalStyles();
  const iconsMainColor = "white";
  const iconsSize = 20;

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarSubMenuOptionsContainer}>
        <MenuButton
          label="Agendar aula"
          icon={{
            component: FontAwesome,
            name: "calendar",
            size: iconsSize,
            color: iconsMainColor,
          }}
          onPress={() =>
            // FEAT ME: Adicionar lógica de agendamento de aula, a data deve ser selecionada antes de clicar aqui
            router.setParams({ subPage: "AGENDAR AULA" })
          } // sem options vira botão normal
        />

        <MenuButton
          label="Próximas aulas"
          icon={{
            component: MaterialCommunityIcons,
            name: "page-next-outline",
            size: iconsSize,
            color: iconsMainColor,
          }}
          onPress={() =>
            router.setParams({ subPage: pageNames.financeiro.dashboards })
          } // sem options vira botão normal
        />

        <MenuButton
          label="Planejar aula selecionada"
          icon={{
            component: MaterialCommunityIcons,
            name: "robot",
            size: iconsSize,
            color: iconsMainColor,
          }}
          onPress={() =>
            router.setParams({ subPage: pageNames.financeiro.dashboards })
          } // sem options vira botão normal
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Agenda</Text>
      </View>
    </View>
  );
}
