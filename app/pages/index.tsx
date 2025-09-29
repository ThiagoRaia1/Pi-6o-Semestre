import { View, Text, StyleSheet } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import Agenda from "./agenda";
import { useLocalSearchParams } from "expo-router";
import Alunos from "./alunos";
import Equipe from "./equipe";
import Financeiro from "./financeiro";
import { pageNames } from "../../utils/pageNames";
import SideBarMenu from "./SideBarMenu";

export default function MainPage() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();

  const styles = StyleSheet.create({
    mainContent: {
      flex: 4,
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      backgroundColor: "#eee",
      zIndex: 1,
    },
  });

  return (
    <View style={[globalStyles.container, { flexDirection: "row" }]}>
      <SideBarMenu />
      {/* Main View */}
      <View style={styles.mainContent}>
        {params.pageName === undefined && <Text>Plenitude Pilates</Text>}
        {params.pageName === pageNames.agenda.main && <Agenda />}
        {params.pageName === pageNames.alunos && <Alunos />}
        {params.pageName === pageNames.equipe && <Equipe />}
        {params.pageName === pageNames.financeiro.main && <Financeiro />}
      </View>
    </View>
  );
}
