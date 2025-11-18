import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthProvider";
import { getGlobalStyles } from "../globalStyles";
import { colors } from "../utils/colors";
import { pageNames, pagePathnames } from "../utils/pageNames";
import DefaultProfileIcon from "./DefaultProfileIcon";
import MenuButton from "./MenuButton";

type SideBarMenuProps = {
  shadow?: boolean;
};

export default function SideBarMenu({ shadow }: SideBarMenuProps) {
  const { isAuthenticated, logout, nome } = useAuth();
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
          alignItems: "center",
          zIndex: 999,
        },
        shadow && { boxShadow: "5px 0px 10px rgba(0, 0, 0, 0.4)" },
      ]}
    >
      <View style={styles.sideBarContent}>
        <View style={styles.userSection}>
          <DefaultProfileIcon size={70} />
          <Text style={styles.usernameText}>{nome}</Text>
        </View>

        <MenuButton
          label={pageNames.agenda.main}
          padding={14}
          onPress={() =>
            router.push({
              pathname: pagePathnames.pages,
              params: {
                pageName: pageNames.agenda.main,
              },
            })
          }
        />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.agenda.main })}
        >
          <Text style={styles.buttonText}>{pageNames.agenda.main}</Text>
        </TouchableOpacity> */}

        <MenuButton
          label={pageNames.cadastros.main}
          // label="Placeholder"
          padding={14}
          onPress={() =>
            router.push({
              pathname: pagePathnames.pages,
              params: {
                pageName: pageNames.cadastros.main,
                subPage: pageNames.cadastros.alunos,
              },
            })
          }
        />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.setParams({ pageName: pageNames.alunos })}
        >
          <Text style={styles.buttonText}>{pageNames.alunos}</Text>
        </TouchableOpacity> */}

        {/* <MenuButton
          label={pageNames.financeiro.main}
          label="Placeholder"
          padding={14}
          onPress={() =>
            router.setParams({ pageName: pageNames.financeiro.main })
          }
        /> */}

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
          color={colors.cancelColor}
          maxWidth={100}
          onPress={() => {
            logout();
            router.push(pagePathnames.main);
          }}
        />
      </View>
    </View>
  );
}
