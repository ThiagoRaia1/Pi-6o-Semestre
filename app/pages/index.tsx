import { View, Text } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import Agenda from "./agenda";
import { router, useLocalSearchParams } from "expo-router";
import Alunos from "./alunos";
import Equipe from "./equipe";
import Financeiro from "./financeiro";
import { pageNames, pagePathnames } from "../../utils/pageNames";
import SideBarMenu from "../components/SideBarMenu";

export default function MainPage() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();

  return (
    <View style={[globalStyles.container, { flexDirection: "row" }]}>
      <SideBarMenu />
      {/* Main View */}
      <View style={[globalStyles.mainContent, { flex: 4 }]}>
        {params.pageName === undefined && <Text>Plenitude Pilates</Text>}
        {params.pageName === pageNames.agenda.main && <Agenda />}
        {params.pageName === pageNames.alunos && <Alunos />}
        {params.pageName === pageNames.equipe && <Equipe />}
        {params.pageName === pageNames.financeiro.main && <Financeiro />}
      </View>
    </View>
  );
}
