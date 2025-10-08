import { useRef } from "react";
import { Animated, Easing } from "react-native";

export function useFadeSlide(initialOpacity = 0, initialOffset = 150) {
  const fadeAnim = useRef(new Animated.Value(initialOpacity)).current;
  const slideAnim = useRef(new Animated.Value(initialOffset)).current;

  const fadeIn = (duration = 1200, callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic), // começa rápido e desacelera
        useNativeDriver: true,
      }),
    ]).start(() => callback?.());
  };

  const fadeOut = (duration = 300, callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: initialOffset,
        duration,
        useNativeDriver: true,
      }),
    ]).start(() => callback?.());
  };

  return { fadeAnim, slideAnim, fadeIn, fadeOut };
}
