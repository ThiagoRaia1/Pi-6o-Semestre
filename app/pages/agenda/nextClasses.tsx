import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../utils/colors";
import { IAula } from "../../../interfaces/aula";
import { useEffect, useRef, useState } from "react";

type NextClassesProps = {
  aulas: IAula[];
  closeModal: () => void;
};

export default function NextClasses({ aulas, closeModal }: NextClassesProps) {
  const sidePanelWidth = 400;
  const [aulasOrdenadas, setAulasOrdenadas] = useState<IAula[]>(aulas);

  // sidebar
  const sidebarAnim = useRef(new Animated.Value(-400)).current;
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
        toValue: 0.6,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // --- fecha sidebar ---
  const closeSidebar = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: -400,
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

  const styles = StyleSheet.create({
    title: {
      color: "white",
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 8,
    },
    text: {
      color: "white",
      marginBottom: 2,
    },
    buttonRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginTop: 10,
    },
    button: {
      flex: 1,
      flexDirection: "row",
      height: 40,
      gap: 10,
      borderRadius: 10,
      zIndex: 10,
      backgroundColor: "#0033A0",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    },
    buttonText: {
      color: "white",
      textAlign: "center",
      fontSize: 14,
      fontWeight: "700",
    },
  });

  useEffect(() => {
    setAulasOrdenadas(
      aulas
        .filter((a) => new Date(a.data) >= new Date()) // Pega apenas as datas seguintes
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    );
    openSidebar();
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        zIndex: 10,
      }}
    >
      {/* overlay com animação */}
      <Animated.View
        style={{
          position: "absolute",
          height: "100%",
          width: "200%",
          zIndex: 9,
          backgroundColor: "rgba(0,0,0,1)",
          opacity: overlayAnim,
        }}
      >
        <Pressable
          style={{ flex: 1, width: "100%", height: "100%" }}
          onPress={handleClose}
        />
      </Animated.View>

      {/* painel lateral animado */}
      <Animated.View
        style={{
          transform: [{ translateX: sidebarAnim }],
          position: "absolute",
          height: "100%",
          width: sidePanelWidth,
          justifyContent: "center",
          alignItems: "center",
          left: 0,
          backgroundColor: "#77A0BB",
          paddingHorizontal: 12,
          paddingVertical: 24,
          zIndex: 10,
        }}
      >
        <Text style={styles.title}>Próximas aulas</Text>

        <ScrollView
          style={{ flex: 1, width: "100%", marginLeft: 12, marginVertical: 16 }}
          contentContainerStyle={{
            width: "100%",
            paddingRight: 12,
            gap: 20,
          }}
        >
          {aulasOrdenadas.map((a) => (
            <View
              key={a.id}
              style={{
                width: "100%",
                justifyContent: "flex-start",
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 10,
                marginVertical: 5,
                paddingHorizontal: 12,
                paddingVertical: 12,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text
                style={[
                  styles.text,
                  { fontSize: 18, fontWeight: "600", marginBottom: 12 },
                ]}
              >
                {new Date(a.data).toLocaleDateString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>

              {a.alunos.length ? (
                a.alunos.map((aluno, idx) => (
                  <Text key={idx} style={styles.text}>
                    {idx + 1} - {aluno.nome}
                  </Text>
                ))
              ) : (
                <Text style={styles.text}>Nenhum aluno registrado na aula</Text>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Planejar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.cancelColor }]}
            onPress={handleClose}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
