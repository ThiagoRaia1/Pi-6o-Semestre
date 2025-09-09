import { View, Text } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import MenuButton from "../../components/MenuButton";
import { router, useLocalSearchParams } from "expo-router";
import { pageNames } from "../../../utils/pageNames";

export default function Financeiro() {
  const globalStyles = getGlobalStyles();
  const dropdownOptions = ["Aluno", "Instrutor", "Usuário"];
  const params = useLocalSearchParams();

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarSubMenuOptionsContainer}>
        <MenuButton
          label="Dashboards"
          onPress={() =>
            router.setParams({ subPage: pageNames.financeiro.dashboards })
          } // sem options vira botão normal
        />
        <MenuButton
          label="Agenda"
          onPress={() => router.setParams({ pageName: pageNames.agenda })} // sem options vira botão normal
        />
        <MenuButton
          label="Agenda"
          onPress={() => router.setParams({ pageName: pageNames.agenda })} // sem options vira botão normal
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {params.subPage === pageNames.financeiro.dashboards && (
          <Text>Financeiro - Dashboards</Text>
        )}
      </View>
    </View>
  );
}
