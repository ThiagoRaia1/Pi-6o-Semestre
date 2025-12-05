import { View, Text } from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { pageNames } from "../../../utils/pageNames";
import MenuButton from "../../../components/MenuButton";
import TopBar from "../../../components/TopBar";

export default function PlanosDeAula() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();

  return (
    <View style={globalStyles.container}>
      <TopBar
        menuButtons={[
          <MenuButton
            label="Agenda"
            onPress={() =>
              router.setParams({ pageName: pageNames.agenda.main })
            } // sem options vira botão normal
          />,
          <MenuButton
            label="Agenda"
            onPress={() =>
              router.setParams({ pageName: pageNames.agenda.main })
            } // sem options vira botão normal
          />,
        ]}
      />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Planos de Aula</Text>
      </View>
    </View>
  );
}
