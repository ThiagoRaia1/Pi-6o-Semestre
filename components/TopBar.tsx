import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "../utils/colors";
import Drawer from "./Drawer";
import { useBreakpoint } from "../hooks/useBreakpoint";

type TopBarProps = {
  menuButtons: React.ReactElement[];
};

export default function TopBar({ menuButtons }: TopBarProps) {
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const drawerIconSize = 20;

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const styles = StyleSheet.create({
    topBarContainer: {
      flexDirection: "row",
      width: "100%",
      paddingHorizontal: isDesktop ? 64 : 16,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: isDesktop ? "flex-end" : "space-between",
      gap: isMobile ? 10 : 40,
      zIndex: 9,
    },
    drawerButton: {
      height: 40,
      backgroundColor: colors.buttonMainColor,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    },
  });

  return (
    <>
      <View style={styles.topBarContainer}>
        {!isDesktop && (
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => setIsDrawerVisible(true)}
          >
            <Feather
              name="menu"
              size={isDesktop ? drawerIconSize / 1.5 : drawerIconSize}
              color="white"
              style={{ marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
        <View
          style={{
            flexDirection: "row",
            gap: isMobile || isTablet ? 20 : 40,
          }}
        >
          {menuButtons}
        </View>
      </View>
      {isDrawerVisible && (
        <Drawer closeModal={() => setIsDrawerVisible(!isDrawerVisible)} />
      )}
    </>
  );
}
