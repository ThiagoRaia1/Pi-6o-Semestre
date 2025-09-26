import { ActivityIndicator, Modal, View } from "react-native";

export default function Loading() {
  return (
    <Modal transparent>
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          width: "100%",
          height: "100%",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={100} />
      </View>
    </Modal>
  );
}
