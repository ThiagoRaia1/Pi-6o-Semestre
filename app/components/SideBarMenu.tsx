import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getGlobalStyles } from "../../globalStyles";

export default function SideBarMenu() {
  const globalStyles = getGlobalStyles();
  const logoutButtonHeight = 50;
  const textMainColor = "white";
  const iconMainColor = "#D581A2";
  const iconSize = 100;

  const styles = StyleSheet.create({
    sideBarContent: {
      flex: 1,
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 30,
    },
    button: {
      width: "100%",
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: textMainColor,
      fontSize: 20,
      fontWeight: 600,
    },
  });

  return (
    <View
      style={[
        globalStyles.mainContent,
        { paddingHorizontal: 20, backgroundColor: "#89B6D5" },
      ]}
    >
      <View
        style={[
          styles.sideBarContent,
          {
            marginTop: logoutButtonHeight,
            // backgroundColor: "yellow",
          },
        ]}
      >
        <FontAwesome name="user-circle" size={iconSize} color={iconMainColor} />
        <Text style={styles.text}>{"Usuario: {Nome do usuário}"}</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>AGENDA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>ALUNOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>EQUIPE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>FINANCEIRO</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: logoutButtonHeight,
        }}
      >
        <Text style={styles.text}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}
