import { View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type DefaultProfileIconProps = {
  size: number;
};

export default function DefaultProfileIcon({ size }: DefaultProfileIconProps) {
  const userIconCircleSize = size * 1.6;
  return (
    <View
      style={{
        backgroundColor: "#D581A1",
        borderRadius: 1000,
        width: userIconCircleSize,
        height: userIconCircleSize,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10,
      }}
    >
      <FontAwesome5 name="user-alt" size={size} color="#FAD2E0" />
    </View>
  );
}
