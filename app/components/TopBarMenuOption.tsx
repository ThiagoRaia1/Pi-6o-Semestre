import { useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Platform,
  Animated,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { getGlobalStyles } from "../../globalStyles";

type MenuOption = {
  label: string;
  onPress?: () => void;
};

export default function MenuButton({
  label,
  options,
  onPress,
}: {
  label: string;
  options?: MenuOption[];
  onPress?: () => void;
}) {
  const globalStyles = getGlobalStyles();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const mainColor: string = "white";
  const dropdownIconSize: number = 20;

  // animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const animationDuration = 400;

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
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
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
    topBarMainMenuOptionsButton: {
      flexDirection: "row",
      minWidth: 250,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      gap: 5,
      borderRadius: 10,
      backgroundColor: "#89B6D5",
      zIndex: 10,
      boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.4)",
    },
    topBarMainMenuOptionsButtonText: {
      color: mainColor,
      fontWeight: 600,
    },
  });

  useEffect(() => {
    if (!options) return;

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
  }, [dropdownVisible, options]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Pressable
      style={{ position: "relative" }}
      onHoverIn={() =>
        options && Platform.OS === "web" && setDropdownVisible(true)
      }
      onHoverOut={() =>
        options && Platform.OS === "web" && setDropdownVisible(false)
      }
    >
      <TouchableOpacity
        style={styles.topBarMainMenuOptionsButton}
        onPress={() => {
          if (options) {
            if (Platform.OS !== "web") {
              setDropdownVisible((prev) => !prev);
            }
          } else if (onPress) {
            onPress();
          }
        }}
        disabled={Platform.OS === "web" && !!options}
      >
        <Text style={styles.topBarMainMenuOptionsButtonText}>{label}</Text>
        {options && (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Entypo
              name="chevron-down"
              size={dropdownIconSize}
              color={mainColor}
            />
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
              pointerEvents: dropdownVisible ? "auto" : "none",
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
                onPress={() => {
                  option.onPress?.();
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownText}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </Pressable>
  );
}
