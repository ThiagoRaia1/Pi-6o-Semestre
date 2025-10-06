import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { colors } from "../utils/colors";
import MenuButton from "../components/MenuButton";
import { useFadeSlide } from "../hooks/useFadeSlide";
import { useEffect, useState } from "react";
import { formatDateToBR } from "../utils/formatDate";
import { useAuth } from "../context/AuthProvider";
import { Picker } from "@react-native-picker/picker";
import { createAula, getAulas } from "../services/aulas";
import { decodeToken } from "../utils/decodeToken";
import Loading from "../components/Loading";
import { router } from "expo-router";

type RegistrarAulaProps = {
  data: string;
  openCloseModal: () => void;
};

export default function RegistrarAula({
  data,
  openCloseModal,
}: RegistrarAulaProps) {
  const { token, name } = useAuth();
  const { fadeAnim, slideAnim, fadeIn, fadeOut } = useFadeSlide();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>(" ");

  const [instrutor, setInstrutor] = useState<string>(name || "");
  const [selectedHora, setSelectedHora] = useState("07:00");

  const horasDisponiveis = Array.from({ length: 12 }, (_, i) => {
    const hora = i + 7;
    return `${hora.toString().padStart(2, "0")}:00`;
  });

  const styles = StyleSheet.create({
    section: {
      flex: 1,
      padding: 20,
    },
    labelText: {
      color: "black",
      marginBottom: 5,
      fontSize: 20,
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#aaa",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      fontSize: 16,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: "#aaa",
      borderRadius: 10,
    },
    picker: {
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
    },
    erroText: {
      color: "red",
    },
  });

  useEffect(() => {
    fadeIn(500);
  }, []);

  const agendarAula = async () => {
    try {
      setIsLoading(true);
      setErro(" ");
      // console.log(selectedHora);
      // console.log(data);
      const dataCompleta = new Date(`${data}T${selectedHora}`);
      // console.log(dataCompleta);
      if (token) {
        await createAula(dataCompleta, await decodeToken(token));
        await getAulas();
        alert("Aula agendada com sucesso!");
        openCloseModal();
        router.reload()
      }
    } catch (erro: any) {
      // alert(erro.message);
      setErro(erro.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal transparent>
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            width: "70%",
            height: "80%",
            backgroundColor: "#eee",
            borderRadius: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View
            style={{
              flex: 1,
              borderWidth: 1,
              padding: 20,
              margin: 30,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30 }}>
              {`Data: ${formatDateToBR(new Date(data))}`}
            </Text>
            <View
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.section}>
                  <Text style={styles.labelText}>Horário</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedHora}
                      onValueChange={(itemValue) => setSelectedHora(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#555"
                    >
                      {horasDisponiveis.map((hora) => (
                        <Picker.Item key={hora} label={hora} value={hora} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.labelText}>Instrutor</Text>
                  {/* ver se vai trocar por um text e nao permitir a atribuicao a outro instrutor */}
                  <TextInput
                    style={styles.input}
                    defaultValue={instrutor}
                    onChangeText={(text) => setInstrutor(text)}
                    editable={false}
                  />
                </View>
              </View>
              <Text style={styles.erroText}>{erro}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 40 }}>
              <MenuButton
                label="Agendar"
                fontWeight={700}
                color={colors.buttonMainColor}
                maxWidth={100}
                onPress={agendarAula}
              />

              <MenuButton
                label="Fechar"
                fontWeight={700}
                color={colors.cancelColor}
                maxWidth={100}
                onPress={openCloseModal}
              />
            </View>
          </View>
        </Animated.View>
      </View>
      {isLoading && <Loading />}
    </Modal>
  );
}
