import { useWindowDimensions } from "react-native";

export const breakpoints = {
  mobile: 550,
  tablet: 800,
  laptop: 1150,
  desktop: 1200,
};

export const useBreakpoint = () => {
  const { width } = useWindowDimensions();

  const isMobile = width <= breakpoints.mobile; // Menor que 550
  const isTablet = width > breakpoints.mobile && width <= breakpoints.tablet; // Entre 551 e 800
  const isLaptop = width > breakpoints.tablet && width <= breakpoints.laptop; // Entre 801 e 1150
  const isDesktop = width > breakpoints.laptop; // Acima de 1150

  return { width, isMobile, isTablet, isLaptop, isDesktop };
};
