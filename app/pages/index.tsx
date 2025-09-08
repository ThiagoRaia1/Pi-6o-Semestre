import { View, Text } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import Agenda from "./agenda";
import { router, useLocalSearchParams } from "expo-router";
import Alunos from "./alunos";
import Equipe from "./equipe";
import Financeiro from "./financeiro";
import { pageNames, pagePathnames } from "../../utils/pageNames";
import MenuButton from "../components/TopBarMenuOption";

export default function MainPage() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarMainMenuOptionsContainer}>
        <MenuButton
          label="Agenda"
          onPress={() =>
            router.replace({
              pathname: pagePathnames.pages, // mantém a tela atual
              params: { pageName: pageNames.agenda }, // só define pageName
            })
          }
        />

        <MenuButton
          label="Registros"
          options={[
            { label: "Alunos", onPress: () => console.log("Alunos") },
            { label: "Instrutores", onPress: () => console.log("Instrutores") },
          ]}
        />

        <MenuButton
          label="Financeiro"
          onPress={() =>
            router.setParams({
              pageName: pageNames.financeiro.main,
              subPage: pageNames.financeiro.dashboards,
            })
          } // sem options vira botão normal
        />

        <MenuButton
          label="Perfil"
          options={[
            { label: "Meu perfil", onPress: () => console.log("Meu perfil") },
            { label: "Sair", onPress: () => router.push("/") },
          ]}
        />
      </View>
      {/* Main View */}
      <View style={[globalStyles.mainContent, { flex: 4 }]}>
        {params.pageName === undefined && <Text>Plenitude Pilates</Text>}
        {params.pageName === pageNames.agenda && <Agenda />}
        {params.pageName === pageNames.alunos && <Alunos />}
        {params.pageName === pageNames.equipe && <Equipe />}
        {params.pageName === pageNames.financeiro.main && <Financeiro />}
      </View>
    </View>
  );
}
