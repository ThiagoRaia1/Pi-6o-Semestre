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

type CreateRegisterProps = {
  openCloseModal: () => void;
};

export default function CreateRegister({
  openCloseModal,
}: CreateRegisterProps) {
  const globalStyles = getGlobalStyles()

  const { subPage } = useLocalSearchParams();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimentoState, setDataNascimentoState] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [senha, setSenha] = useState("");

  const [erros, setErros] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    senha: "",
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
    const isAluno = subPage.toString() === pageNames.cadastros.alunos;
    const isEquipe = subPage.toString() === pageNames.cadastros.equipe;

    const novosErros = {
      nome: nome.trim() ? "" : "Nome é obrigatório",
      cpf: isAluno && !cpf.trim() ? "CPF é obrigatório" : "",
      dataNascimento:
        isAluno && !dataNascimentoState.trim()
          ? "Data de nascimento é obrigatória"
          : "",
      email: email.trim() ? "" : "Email é obrigatório",
      telefone: isAluno && !telefone.trim() ? "Telefone é obrigatório" : "",
      senha: isEquipe && !senha.trim() ? "Senha é obrigatória" : "",
    };

    setErros(novosErros);
    return Object.values(novosErros).every((e) => e === "");
  };

  const handleRegister = async () => {
    if (!validarCampos()) return;

    try {
      setIsLoading(true);
      if (subPage.toString() === pageNames.cadastros.alunos) {
        const dataFormatadaToNewDate = `${dataNascimentoState.slice(
          6,
          10
        )}-${dataNascimentoState.slice(3, 5)}-${dataNascimentoState.slice(
          0,
          2
        )}`;

        await createAluno({
          nome,
          cpf,
          dataNascimento: dataFormatadaToNewDate,
          email,
          telefone,
          descricao,
          isAtivo: true,
        });
        alert("Aluno registrado com sucesso!");
        router.push({
          pathname: pagePathnames.pages,
          params: {
            pageName: pageNames.cadastros.main,
            subPage: pageNames.cadastros.alunos,
          },
        });
      }

      if (subPage.toString() === pageNames.cadastros.equipe) {
        await createUsuario({
          email,
          senha,
          nome,
          isAtivo: true,
        });
        alert("Usuário registrado com sucesso!");
        router.push({
          pathname: pagePathnames.pages,
          params: {
            pageName: pageNames.cadastros.main,
            subPage: pageNames.cadastros.equipe,
          },
        });
      }
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
            {subPage.toString() === pageNames.cadastros.alunos && (
              <>
                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Nome:*</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={nome}
                      onChangeText={setNome}
                    />
                    <Text style={globalStyles.erroText}>{erros.nome}</Text>
                  </View>

                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>CPF:*</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={cpf}
                      onChangeText={setCpf}
                    />
                    <Text style={globalStyles.erroText}>{erros.cpf}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Data de nascimento:*</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={dataNascimentoState}
                      onChangeText={setDataNascimentoState}
                      placeholder="dd/mm/aaaa"
                      placeholderTextColor={"#bbb"}
                    />
                    <Text style={globalStyles.erroText}>{erros.dataNascimento}</Text>
                  </View>

                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Email:*</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={email}
                      onChangeText={setEmail}
                    />
                    <Text style={globalStyles.erroText}>{erros.email}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Telefone:*</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={telefone}
                      onChangeText={setTelefone}
                    />
                    <Text style={globalStyles.erroText}>{erros.telefone}</Text>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.labelText}>Descrição:</Text>
                  <TextInput
                    style={[globalStyles.input, { textAlignVertical: "top" }]}
                    multiline
                    value={descricao}
                    onChangeText={setDescricao}
                  />
                  {/* sem validação */}
                  <Text style={globalStyles.erroText}> </Text>
                </View>
              </>
            )}

            {subPage.toString() === pageNames.cadastros.equipe && (
              <>
                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Nome:</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={nome}
                      onChangeText={setNome}
                    />
                    <Text style={globalStyles.erroText}>{erros.nome}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Email:</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={email}
                      onChangeText={setEmail}
                    />
                    <Text style={globalStyles.erroText}>{erros.email}</Text>
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Senha:</Text>
                    <TextInput
                      style={globalStyles.input}
                      value={senha}
                      onChangeText={setSenha}
                    />
                    <Text style={globalStyles.erroText}>{erros.senha}</Text>
                  </View>
                </View>
              </>
            )}
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
