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
import { createPlanoDeAula } from "../../../services/planoDeAula";
import { updateAula } from "../../../services/aulas";

type SetPlanoDeAulaModalProps = {
  openCloseModal: () => void;
  planoGerado: string;
  aulaId?: number;
};

export default function SetPlanoDeAulaModal({
  openCloseModal,
  planoGerado,
  aulaId,
}: SetPlanoDeAulaModalProps) {
  const globalStyles = getGlobalStyles();

  const { subPage } = useLocalSearchParams();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);

  const [planoGeradoInput, setPlanoGeradoInput] = useState<string>(planoGerado);

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

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const planoDeAula: IPlanoDeAula = await createPlanoDeAula({
        plano: planoGeradoInput,
        salvo: false,
      });

      if (aulaId) {
        await updateAula(aulaId, { planoDeAula });

        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.agenda.main },
        });
      }
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
          <Text style={styles.title}>Editar plano gerado</Text>
          <View style={{ flex: 1, justifyContent: "center", gap: 20 }}>
            <TextInput
              multiline={true}
              style={globalStyles.input}
              defaultValue={planoGeradoInput}
              onChangeText={(text) => setPlanoGeradoInput(text)}
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
