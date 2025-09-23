import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import { router } from "expo-router";
import { pageNames, pagePathnames } from "../../utils/pageNames";
import { colors } from "../../utils/colors";
import DefaultProfileIcon from "../components/DefaultProfileIcon";
import MenuButton from "../components/MenuButton";
import { useAuth } from "../../context/AuthProvider";

export default function SideBarMenu() {
  const { isAuthenticated, logout, name } = useAuth()
  const globalStyles = getGlobalStyles();

  const styles = StyleSheet.create({
    sideBarContent: {
      width: "100%",
      maxWidth: 280,
      gap: 25,
      alignItems: "center",
    },
    userSection: {
      alignItems: "center",
    },
    usernameText: {
      color: "white",
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 10,
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
          <DefaultProfileIcon size={70} />
          <Text style={styles.usernameText}>
            {`Usuário: ${name}`}
          </Text>
        </View>

        <MenuButton
          label={pageNames.agenda.main}
          padding={14}
          onPress={() => router.setParams({ pageName: pageNames.agenda.main })}
        />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.agenda.main })}
        >
          <Text style={styles.buttonText}>{pageNames.agenda.main}</Text>
        </TouchableOpacity> */}

        <MenuButton
          label={pageNames.alunos}
          padding={14}
          onPress={() => router.setParams({ pageName: pageNames.alunos })}
        />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.alunos })}
        >
          <Text style={styles.buttonText}>{pageNames.alunos}</Text>
        </TouchableOpacity> */}

        <MenuButton
          label={pageNames.financeiro.main}
          padding={14}
          onPress={() =>
            router.setParams({ pageName: pageNames.financeiro.main })
          }
        />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.setParams({ pageName: pageNames.financeiro.main })
          }
        >
          <Text style={styles.buttonText}>{pageNames.financeiro.main}</Text>
        </TouchableOpacity> */}

        <MenuButton
          label="LOGOUT"
          fontSize={16}
          fontWeight={700}
          padding={10}
          color="#E63946"
          maxWidth={100}
          onPress={() => {
            logout()
            router.push(pagePathnames.main)
          }}
        />
      </View>
    </View>
  );
}
