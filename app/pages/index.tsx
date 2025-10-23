import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import Agenda from "./agenda";
import { useLocalSearchParams } from "expo-router";
import Alunos from "./alunos";
import Equipe from "./equipe";
import Financeiro from "./financeiro";
import { pageNames } from "../../utils/pageNames";
import SideBarMenu from "./SideBarMenu";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useState } from "react";

export default function MainPage() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();
  const { isLaptop, isDesktop } = useBreakpoint();
  const [isNextClassesVisible, setIsNextClassesVisible] = useState(false);

  const styles = StyleSheet.create({
    mainContent: {
      flex: 4,
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      // backgroundColor: "#eee",
      zIndex: 1,
    },
  });

  return (
    <View style={[globalStyles.container, { flexDirection: "row" }]}>
      {isDesktop && <SideBarMenu shadow={isNextClassesVisible} />}
      {/* Main View */}
      <View style={styles.mainContent}>
        <ImageBackground
          source={require("../../assets/background.jpeg")}
          resizeMode="stretch"
          style={{ flex: 1, width: "100%", height: "100%" }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {params.pageName === undefined && <Text>Plenitude Pilates</Text>}
            {params.pageName === pageNames.agenda.main && (
              <Agenda
                onToggleNextClasses={(visible: boolean) =>
                  setIsNextClassesVisible(visible)
                }
              />
            )}
            {params.pageName === pageNames.alunos && <Alunos />}
            {params.pageName === pageNames.equipe && <Equipe />}
            {params.pageName === pageNames.financeiro.main && <Financeiro />}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
