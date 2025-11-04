import { Modal, View, StyleSheet, Animated, Text } from "react-native";
import { useEffect, useState } from "react";
import { IUser } from "../interfaces/user";
import { useAuth } from "../context/AuthProvider";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useFadeSlide } from "../hooks/useFadeSlide";
import { IAluno } from "../interfaces/aluno";
import { IAula } from "../interfaces/aula";
import { colors } from "../utils/colors";
import Loading from "./Loading";
import MenuButton from "./MenuButton";
import { router } from "expo-router";
import { deleteAula } from "../services/aulas";
import { pagePathnames, pageNames } from "../utils/pageNames";
import { formatDateToBR } from "../utils/formatDate";

type ConfirmationModalProps = {
  item: IAluno | IAula | IUser | null;
  openCloseModal: () => void;
};

export default function ConfirmationModal({
  item,
  openCloseModal,
}: ConfirmationModalProps) {
  const { token, nome } = useAuth();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fadeIn(500);
  }, []);

  const handleDeleteClass = async (aulaId: number) => {
    try {
      setIsLoading(true);
      const resultado = await deleteAula(aulaId);

      alert("Aula deletada com sucesso!");
      router.push({
        pathname: pagePathnames.pages,
        params: { pageName: pageNames.agenda.main, subPage: "AGENDAR AULA" },
      });
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(
    item && "data" in item
      ? `a aula do dia ${formatDateToBR(item.data)} às ${new Date(
          item.data
        ).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}?`
      : item && "senha" in item
      ? `o usuário ${item.nome} (${item.email})`
      : `o aluno ${item?.nome}`
  );

  const styles = StyleSheet.create({
    title: {
      color: "black",
      marginBottom: 5,
      fontSize: 20,
      textAlign: "center",
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#aaa",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      fontSize: 16,
      backgroundColor: "#fff",
    },
    botaoAddRemove: {
      backgroundColor: colors.buttonMainColor,
      borderRadius: 8,
      minWidth: 50,
      minHeight: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    botaoTexto: {
      color: "#fff",
      fontWeight: "900",
      fontSize: 20,
      width: "100%",
      height: "100%",
      textAlign: "center",
    },
  });

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
            maxWidth: 1000,
            height: "20%",
            justifyContent: "center",
            backgroundColor: "#eee",
            borderRadius: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            padding: 20,
            gap: 10,
          }}
        >
          <Text style={styles.title}>
            {`Tem certeza que deseja excluir ${
              item && "data" in item
                ? `a aula do dia ${formatDateToBR(item.data)} às ${new Date(
                    item.data
                  ).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}?`
                : item && "senha" in item
                ? `o usuário ${item.nome} (${item.email})`
                : `o aluno ${item?.nome}`
            }`}
          </Text>

          {/* BOTÕES FINAIS */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 10,
            }}
          >
            <MenuButton
              label="Excluir"
              fontWeight={700}
              color={colors.cancelColor}
              maxWidth={130}
              onPress={() => {
                if (item) {
                  if ("data" in item) {
                    handleDeleteClass(item.id);
                  }
                  if ("senha" in item) {
                  }
                }
                openCloseModal(); // fecha o modal após exclusão
              }}
            />

            <MenuButton
              label="Fechar"
              fontWeight={700}
              color={colors.buttonMainColor}
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
