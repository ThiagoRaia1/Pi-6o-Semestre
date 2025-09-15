import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getGlobalStyles } from "../../globalStyles";
import { router } from "expo-router";
import { pageNames, pagePathnames } from "../../utils/pageNames";
import { colors } from "../../utils/colors";

export default function SideBarMenu() {
  const globalStyles = getGlobalStyles();
  const textMainColor = "#fff";
  const iconMainColor = "#D581A2"; // tom mais suave
  const iconSize = 90;

  const styles = StyleSheet.create({
    sideBarContent: {
      width: "100%",
      alignItems: "center",
      gap: 25,
    },
    userSection: {
      alignItems: "center",
      marginBottom: 30,
    },
    button: {
      width: "100%",
      maxWidth: 280,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: "rgba(255,255,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    buttonText: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
    },
    logoutButton: {
      backgroundColor: "#E63946", // vermelho para destaque
      maxWidth: 200,
      paddingVertical: 12,
      borderRadius: 12,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "700",
    },
  });

  return (
    <View
      style={[
        globalStyles.mainContent,
        {
          paddingHorizontal: 20,
          backgroundColor: colors.main,
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
          zIndex: 10,
          alignItems: "center",
        },
      ]}
    >
      <View style={styles.sideBarContent}>
        <View style={styles.userSection}>
          <FontAwesome
            name="user-circle"
            size={iconSize}
            color={iconMainColor}
          />
          <Text style={[styles.buttonText, { marginTop: 10, fontSize: 20 }]}>
            {"Usuário: {nome do usuario}"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.agenda.main })}
        >
          <Text style={styles.buttonText}>{pageNames.agenda.main}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.alunos })}
        >
          <Text style={styles.buttonText}>{pageNames.alunos}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.setParams({ pageName: pageNames.financeiro.main })
          }
        >
          <Text style={styles.buttonText}>{pageNames.financeiro.main}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => router.push(pagePathnames.main)}
      >
        <Text style={[styles.buttonText, styles.logoutText]}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}
