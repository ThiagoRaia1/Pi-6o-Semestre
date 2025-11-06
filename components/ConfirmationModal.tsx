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
import { ativarAluno, desativarAluno } from "../services/alunos";
import { ativarUsuario, desativarUsuario } from "../services/usuarios";

type ConfirmationModalProps = {
  item: IAluno | IAula | IUser | null;
  openCloseModal: () => void;
};

export default function ConfirmationModal({
  item,
  openCloseModal,
}: ConfirmationModalProps) {
  const { nome } = useAuth();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);

  const itemIsAula = item && "data" in item && true;
  const itemIsAluno = item && "descricao" in item && true;
  const itemIsUser = item && "senha" in item && true;

  useEffect(() => {
    fadeIn(500);
  }, []);

  const handleDeleteItem = async (item: IAluno | IUser | IAula) => {
    try {
      setIsLoading(true);
      if (itemIsAula) {
        const resultado = await deleteAula(item.id);

        alert("Aula deletada com sucesso!");
        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.agenda.main, subPage: "AGENDAR AULA" },
        });
      }

      if (itemIsAluno) {
        if (item && "descricao" in item && !item.isAtivo) {
          const resultado = await ativarAluno(item.id);
          alert("Aluno(a) ativado(a) com sucesso!");
        }

        if (item && "descricao" in item && item.isAtivo) {
          const resultado = await desativarAluno(item.id);
          alert("Aluno(a) desativado(a) com sucesso!");
        }

        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.alunos, subPage: "ALUNOS" },
        });
      }

      if (itemIsUser) {
        if (item && "senha" in item && !item.isAtivo) {
          const resultado = await ativarUsuario(item.id);
          alert("Usuário ativado com sucesso!");
        }

        if (item && "senha" in item && item.isAtivo) {
          const resultado = await desativarUsuario(item.id);
          alert("Usuário desativado com sucesso!");
        }

        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.alunos, subPage: "EQUIPE" },
        });
      }
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setIsLoading(false);
    }
  };

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
            {item &&
              `Tem certeza que deseja ${
                "email" in item && item.isAtivo
                  ? "excluir"
                  : "email" in item && !item.isAtivo
                  ? "ativar"
                  : "excluir"
              } ${
                "data" in item
                  ? `a aula do dia ${formatDateToBR(item.data)} às ${new Date(
                      item.data
                    ).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "senha" in item
                  ? `o usuário "${item.nome} (${item.email})"`
                  : `o(a) aluno(a) "${item?.nome}"`
              }?`}
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
              label={
                item && "email" in item && item.isAtivo
                  ? "Excluir"
                  : item && "email" in item && !item.isAtivo
                  ? "Ativar"
                  : "Excluir"
              }
              fontWeight={700}
              color={
                item && "email" in item && item.isAtivo
                  ? colors.cancelColor
                  : item && "email" in item && !item.isAtivo
                  ? "green"
                  : colors.cancelColor
              }
              maxWidth={130}
              onPress={() => {
                if (item) handleDeleteItem(item);
                openCloseModal; // fecha o modal após exclusão
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
