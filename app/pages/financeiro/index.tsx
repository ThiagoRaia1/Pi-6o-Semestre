import { View, Text } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { pageNames } from "../../../utils/pageNames";
import MenuButton from "../../../components/MenuButton";

export default function Financeiro() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarMainMenuOptionsContainer}>
        <MenuButton
          label="Dashboards"
          onPress={() =>
            router.setParams({ subPage: pageNames.financeiro.dashboards })
          } // sem options vira botão normal
        />
        <MenuButton
          label="Agenda"
          onPress={() => router.setParams({ pageName: pageNames.agenda.main })} // sem options vira botão normal
        />
        <MenuButton
          label="Agenda"
          onPress={() => router.setParams({ pageName: pageNames.agenda.main })} // sem options vira botão normal
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
