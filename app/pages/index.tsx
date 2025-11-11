import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import Agenda from "./agenda";
import { useLocalSearchParams } from "expo-router";
import Financeiro from "./financeiro";
import { pageNames } from "../../utils/pageNames";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useState } from "react";
import Cadastros from "./cadastros";
import SideBarMenu from "../../components/SideBarMenu";

export default function MainPage() {
  const globalStyles = getGlobalStyles();
  const params = useLocalSearchParams();
  const { isDesktop } = useBreakpoint();
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
            {params.pageName === pageNames.cadastros.main && <Cadastros />}
            {params.pageName === pageNames.financeiro.main && <Financeiro />}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
