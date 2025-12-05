import { StyleSheet } from "react-native";
import { colors } from "./utils/colors";
import { useBreakpoint } from "./hooks/useBreakpoint";

export const getGlobalStyles = () => {
  const { isDesktop } = useBreakpoint();

  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 0,
    },
    mainContent: {
      flex: 1,
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      // backgroundColor: "#eee",
      zIndex: 1,
      paddingHorizontal: isDesktop ? 64 : 16,
    },
    topBarSubMenuOptionsContainer: {
      width: "100%",
      minHeight: 60,
      backgroundColor: colors.buttonMainColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: 10,
      zIndex: 8,
    },
    input: {
      flex: 1,
      width: "100%",
      borderWidth: 1,
      borderColor: "#aaa",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      fontSize: 16,
      backgroundColor: "#fff",
    },
    erroText: {
      color: "red",
      marginTop: 5,
      minHeight: 22, // <-- mantém o espaço fixo para a mensagem de erro
    },
    actionButton: {
      padding: 5,
      borderRadius: 10,
      alignSelf: "center",
    },
  });
};
