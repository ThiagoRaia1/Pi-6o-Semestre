import { View, Text } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import SideBarMenu from "../components/SideBarMenu";
import Agenda from "./agenda";
import { useLocalSearchParams, usePathname } from "expo-router";
import Alunos from "./alunos";
import Equipe from "./equipe";
import Financeiro from "./financeiro";
import { pageNames } from "../../utils/pageNames";

export default function MainPage() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();

  return (
    <View style={[globalStyles.container, { flexDirection: "row" }]}>
      {/* Menu lateral */}
      <SideBarMenu />

      {/* Main View */}
      <View style={[globalStyles.mainContent, { flex: 4 }]}>
        {params.pageName === undefined && <Text>Plenitude Pilates</Text>}
        {params.pageName === pageNames.agenda && <Agenda />}
        {params.pageName === pageNames.alunos && <Alunos />}
        {params.pageName === pageNames.equipe && <Equipe />}
        {params.pageName === pageNames.financeiro && <Financeiro />}
      </View>
    </View>
  );
}
