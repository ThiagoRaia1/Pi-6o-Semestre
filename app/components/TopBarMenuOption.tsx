import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { getGlobalStyles } from "../../globalStyles";

export default function MenuButton({
  label,
  options,
}: {
  label: string;
  options?: string[];
}) {
  const globalStyles = getGlobalStyles();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // animações dropdown
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  // animação do ícone
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const animationDuration = 300;

  const styles = StyleSheet.create({
    dropdown: {
      position: "absolute",
      width: "100%",
      top: "100%",
      left: 0,
      backgroundColor: "#333",
      borderBottomStartRadius: 6,
      borderBottomEndRadius: 6,
      marginTop: -7,
      paddingTop: 10,
      zIndex: 9,
      elevation: 5, // sombra Android
      shadowColor: "#000", // sombra iOS
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      // sombra Web
      ...(Platform.OS === "web"
        ? { boxShadow: "0px 4px 10px rgba(0,0,0,0.4)" }
        : {}),
    },
    dropdownItem: {
      padding: 10,
    },
    dropdownText: {
      color: "white",
      fontSize: 14,
    },
  });

  useEffect(() => {
    if (dropdownVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [dropdownVisible]);

  // ângulo do ícone (0 = baixo, 180 = cima)
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Pressable
      style={{ position: "relative" }}
      onHoverIn={() => Platform.OS === "web" && setDropdownVisible(true)}
      onHoverOut={() => Platform.OS === "web" && setDropdownVisible(false)}
    >
      <TouchableOpacity
        style={globalStyles.topBarMainMenuOptionsButton}
        onPress={() =>
          Platform.OS !== "web" && setDropdownVisible((prev) => !prev)
        }
        disabled={Platform.OS === "web"} // no web só hover funciona
      >
        <Text style={globalStyles.topBarMainMenuOptionsButtonText}>
          {label}
        </Text>
        {options && (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Entypo name="chevron-down" size={20} color="white" />
          </Animated.View>
        )}
      </TouchableOpacity>

      {options && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              // remove display
              pointerEvents: dropdownVisible ? "auto" : "none", // evita clique quando fechado
            },
          ]}
        >
          {options.map((option, idx) => {
            const isLast = idx === options.length - 1;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dropdownItem,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: "#555",
                  },
                ]}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </Pressable>
  );
}
