import { Modal, View, StyleSheet, Animated, Text } from "react-native";
import { useEffect, useState } from "react";
import { IUser } from "../interfaces/user";
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
  aula?: IAula;
  aluno?: IAluno;
  usuario?: IUser;
  openCloseModal: () => void;
};

export default function ConfirmationModal({
  aula,
  aluno,
  usuario,
  openCloseModal,
}: ConfirmationModalProps) {
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fadeIn(500);
  }, []);

  const handleDeleteItem = async () => {
    try {
      setIsLoading(true);

      if (aula) {
        await deleteAula(aula.id);
        alert("Aula deletada com sucesso!");
        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.agenda.main, subPage: "AGENDAR AULA" },
        });
      }

      if (aluno) {
        if (aluno.isAtivo) {
          await desativarAluno(aluno.id);
          alert("Aluno(a) desativado(a) com sucesso!");
        } else {
          await ativarAluno(aluno.id);
          alert("Aluno(a) ativado(a) com sucesso!");
        }

        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.alunos, subPage: "ALUNOS" },
        });
      }

      if (usuario) {
        if (usuario.isAtivo) {
          await desativarUsuario(usuario.id);
          alert("Usuário desativado com sucesso!");
        } else {
          await ativarUsuario(usuario.id);
          alert("Usuário ativado com sucesso!");
        }

        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.alunos, subPage: "EQUIPE" },
        });
      }

      openCloseModal();
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
    botaoTexto: {
      color: "#fff",
      fontWeight: "900",
      fontSize: 20,
      textAlign: "center",
    },
  });

  const mensagem = aula
    ? `excluir a aula do dia ${formatDateToBR(aula.data)} às ${new Date(
        aula.data
      ).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}?`
    : aluno
    ? `${aluno.isAtivo ? "desativar" : "ativar"} o(a) aluno(a) ${aluno.nome}?`
    : usuario
    ? `${usuario.isAtivo ? "desativar" : "ativar"} o(a) usuário(a) ${
        usuario.nome
      }?`
    : "";

  const textoBotaoConfirmar =
    aluno || usuario
      ? aluno?.isAtivo || usuario?.isAtivo
        ? "Desativar"
        : "Ativar"
      : "Excluir";

  const corBotaoConfirmar =
    aluno || usuario
      ? aluno?.isAtivo || usuario?.isAtivo
        ? colors.cancelColor
        : "green"
      : colors.cancelColor;

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
            justifyContent: "center",
            backgroundColor: "#eee",
            borderRadius: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            padding: 20,
            gap: 10,
          }}
        >
          <Text style={styles.title}>Tem certeza que deseja {mensagem}</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 10,
            }}
          >
            <MenuButton
              label={textoBotaoConfirmar}
              fontWeight={700}
              color={corBotaoConfirmar}
              maxWidth={130}
              onPress={handleDeleteItem}
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
