import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { colors } from "../utils/colors";
import MenuButton from "./MenuButton";
import { router } from "expo-router";
import { pageNames, pagePathnames } from "../utils/pageNames";
import logout from "../app/auth/logout";
import { breakpoints } from "../hooks/useBreakpoint";

type DrawerProps = {
  closeModal: () => void;
};

export default function Drawer({ closeModal }: DrawerProps) {
  const sidePanelWidth = 500;
  const windowWidth = useWindowDimensions().width;

  // sidebar
  const sidebarAnim = useRef(new Animated.Value(-sidePanelWidth)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- abre sidebar ---
  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.parallel([
      Animated.spring(sidebarAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 11,
        tension: 70,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // --- fecha sidebar ---
  const closeSidebar = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: -sidePanelWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setSidebarOpen(false);
      callback?.(); // só desmonta depois que a animação acaba
    });
  };

  // --- handler para fechar ---
  const handleClose = () => {
    closeSidebar(closeModal);
  };

  useEffect(() => {
    openSidebar();
  }, []);

  const styles = StyleSheet.create({});

  return (
    <>
      {windowWidth < breakpoints.laptop && (
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 997,
            opacity: overlayAnim,
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              width: "100%",
              height: "100%",
              zIndex: 998,
            }}
            onPress={handleClose}
          />
          <Animated.View
            style={{
              transform: [{ translateX: sidebarAnim }],
              position: "absolute",
              left: 0,
              backgroundColor: "white",
              height: "100%",
              width: "100%",
              maxWidth: sidePanelWidth,
              zIndex: 999,
              justifyContent: "center",
              alignContent: "center",
              padding: 20,
              gap: 20,
            }}
          >
            <TouchableOpacity
              style={{
                height: "100%",
                maxHeight: 40,
                width: "100%",
                backgroundColor: "black",
                borderRadius: 10,
                padding: 10,
              }}
              onPress={handleClose}
            >
              <Text style={{ fontWeight: 800, color: "white" }}>X</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, gap: 20 }}>
              <MenuButton
                label={pageNames.agenda.main}
                color={colors.buttonMainColor}
                onPress={() =>
                  router.push({
                    pathname: pagePathnames.pages,
                    params: {
                      pageName: pageNames.agenda.main,
                    },
                  })
                }
              />

              <MenuButton
                label={pageNames.alunos}
                color={colors.buttonMainColor}
                onPress={() =>
                  router.setParams({
                    pageName: pageNames.alunos,
                    subPage: "ALUNOS",
                  })
                }
              />

              <MenuButton
                label="Placeholder"
                color={colors.buttonMainColor}
                onPress={() => {}}
              />
            </View>
            <MenuButton
              label="LOGOUT"
              fontSize={16}
              fontWeight={700}
              padding={10}
              color={colors.cancelColor}
              onPress={() => {
                logout();
                router.push(pagePathnames.main);
              }}
            />
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
}
