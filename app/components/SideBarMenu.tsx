import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getGlobalStyles } from "../../globalStyles";
import { router } from "expo-router";
import { pageNames } from "../../utils/pageNames";

export default function SideBarMenu() {
  const globalStyles = getGlobalStyles();
  const logoutButtonHeight = 60;
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
      maxWidth: 300,
      padding: 10,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: "#7dcce0",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 1)",
    },
    text: {
      color: textMainColor,
      fontSize: 20,
      fontWeight: 600,
      textAlign: "center",
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.agenda })}
        >
          <Text style={styles.text}>{pageNames.agenda}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.alunos })}
        >
          <Text style={styles.text}>{pageNames.alunos}</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.equipe })}
        >
          <Text style={styles.text}>{pageNames.equipe}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.financeiro })}
        >
          <Text style={styles.text}>{pageNames.financeiro}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { maxWidth: 150, marginBottom: 10 }]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.text}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}
