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
import { IPlanoDeAula } from "../../../interfaces/planoDeAula";
import {
  createPlanoDeAula,
  updatePlanoDeAula,
} from "../../../services/planoDeAula";
import { updateAula } from "../../../services/aulas";

type EditPlanoDeAulaProps = {
  openCloseModal: () => void;
  planoDeAula: IPlanoDeAula;
};

export default function EditPlanoDeAula({
  openCloseModal,
  planoDeAula,
}: EditPlanoDeAulaProps) {
  const globalStyles = getGlobalStyles();

  const { subPage } = useLocalSearchParams();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);

  const [titulo, setTitulo] = useState<string>();
  const [plano, setPlano] = useState<string>(planoDeAula.plano);
  const [salvo, setSalvo] = useState<boolean>(planoDeAula.salvo);

  useEffect(() => {
    if (planoDeAula.titulo) {
      setTitulo(planoDeAula.titulo);
    }
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
    input: {
      flex: 1,
      width: "100%",
      borderWidth: 1,
      borderColor: "#aaa",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      fontSize: 16,
      backgroundColor: "#fff",
    },
    erroText: {
      color: "red",
      marginTop: 5,
      minHeight: 22, // <-- mantém o espaço fixo para a mensagem de erro
    },
  });

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      const resultado: IPlanoDeAula = await updatePlanoDeAula(planoDeAula.id, {
        titulo,
        plano,
      });

      alert("Plano de aula atualiado com sucesso!")
      router.push({
        pathname: pagePathnames.pages,
        params: { pageName: pageNames.planosDeAula.main },
      });
    } catch (erro: any) {
      console.log(erro.message);
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
          <Text style={styles.title}>Editar plano</Text>
          <View style={{ flex: 1, justifyContent: "center", gap: 10 }}>
            <Text>Título</Text>
            <TextInput
              style={[globalStyles.input, { flex: 0 }]}
              defaultValue={titulo}
              onChangeText={(text) => setTitulo(text)}
            />

            <Text>Plano</Text>
            <TextInput
              multiline={true}
              style={globalStyles.input}
              defaultValue={plano}
              onChangeText={(text) => setPlano(text)}
            />
          </View>

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
              onPress={handleEdit}
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
