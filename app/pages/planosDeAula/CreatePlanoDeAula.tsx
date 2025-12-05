import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import MenuButton from "../../../components/MenuButton";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { useFadeSlide } from "../../../hooks/useFadeSlide";
import { colors } from "../../../utils/colors";
import { router, useLocalSearchParams } from "expo-router";
import { createAluno } from "../../../services/alunos";
import { createUsuario } from "../../../services/usuarios";
import { pageNames, pagePathnames } from "../../../utils/pageNames";
import { getGlobalStyles } from "../../../globalStyles";
import { createPlanoDeAula } from "../../../services/planoDeAula";

type CreatePlanoDeAulaProps = {
  openCloseModal: () => void;
};

export default function CreatePlanoDeAula({
  openCloseModal,
}: CreatePlanoDeAulaProps) {
  const globalStyles = getGlobalStyles();

  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [plano, setPlano] = useState("");

  const [erros, setErros] = useState({
    titulo: "",
    plano: "",
  });

  const [erroGeral, setErroGeral] = useState("");

  useEffect(() => {
    fadeIn(500);
  }, []);

  const styles = StyleSheet.create({
    title: {
      fontSize: 36,
      textAlign: "center",
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 40,
    },
    rowColunm: {
      flex: 1,
    },
    labelText: {
      color: "black",
      marginBottom: 5,
      fontSize: 20,
    },
  });

  const validarCampos = () => {
    const novosErros = {
      titulo: titulo.trim() ? "" : "Titulo é obrigatório",
      plano: plano.trim() ? "" : "Plano é obrigatório",
    };

    setErros(novosErros);
    return Object.values(novosErros).every((e) => e === "");
  };

  const handleRegister = async () => {
    if (!validarCampos()) return;

    try {
      setIsLoading(true);
      const resultado = await createPlanoDeAula({ titulo, plano, salvo: true });

      alert("Plano de aula criado com sucesso!");

      router.push({
        pathname: pagePathnames.pages,
        params: {
          pageName: pageNames.planosDeAula.main,
        },
      });
    } catch (erro: any) {
      setErroGeral(erro.message);
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
          padding: isDesktop ? 64 : 16,
          paddingVertical: isLaptop ? 64 : undefined,
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            maxWidth: 1500,
            height: "100%",
            backgroundColor: "#eee",
            borderRadius: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            padding: 40,
            gap: 10,
          }}
        >
          <Text style={styles.title}>Criar registro</Text>
          <View style={{ flex: 1, justifyContent: "center", gap: 20 }}>
            <View style={styles.row}>
              <View style={styles.rowColunm}>
                <Text style={styles.labelText}>Titulo:*</Text>
                <TextInput
                  style={globalStyles.input}
                  value={titulo}
                  onChangeText={setTitulo}
                />
                <Text style={globalStyles.erroText}>{erros.titulo}</Text>
              </View>

              <View style={styles.rowColunm}>
                <Text style={styles.labelText}>Plano:*</Text>
                <TextInput
                  style={globalStyles.input}
                  value={plano}
                  onChangeText={setPlano}
                />
                <Text style={globalStyles.erroText}>{erros.plano}</Text>
              </View>
            </View>
          </View>

          <Text style={[globalStyles.erroText, { textAlign: "center" }]}>
            {erroGeral}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 10,
            }}
          >
            <MenuButton
              label="Registrar"
              fontWeight={700}
              color={colors.buttonMainColor}
              maxWidth={130}
              onPress={handleRegister}
            />
            <MenuButton
              label="Fechar"
              fontWeight={700}
              color={colors.cancelColor}
              maxWidth={130}
              onPress={openCloseModal}
            />
          </View>
        </Animated.View>
      </View>
      {isLoading && <Loading />}
    </Modal>
  );
}
