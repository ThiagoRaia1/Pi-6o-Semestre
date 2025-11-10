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
import { pagePathnames } from "../../../utils/pageNames";

type CreateRegisterProps = {
  openCloseModal: () => void;
};

export default function CreateRegister({
  openCloseModal,
}: CreateRegisterProps) {
  const { subPage } = useLocalSearchParams();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();

  const [nome, setNome] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [dataNascimentoState, setDataNascimentoState] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const [senha, setSenha] = useState<string>("");

  // Incluir campo registradoPor/ultimaAlteracao na entidade Aluno
  // const [instrutor, setInstrutor] = useState(aluno.registradoPor)

  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(" ");

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
    pickerContainer: {
      borderWidth: 1,
      borderColor: "#aaa",
      borderRadius: 10,
      backgroundColor: "#fff",
    },
    picker: {
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: "#aaa",
      borderRadius: 10,
      backgroundColor: "#fff",
      paddingHorizontal: 15,
      paddingVertical: 8,
      fontSize: 16,
      marginBottom: 10,
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
    erroText: {
      color: "red",
      marginTop: 5,
      textAlign: "center",
    },
  });

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      if (subPage.toString() === "ALUNOS") {
        const dataFormatadaToNewDate = `${dataNascimentoState.slice(
          6,
          10
        )}-${dataNascimentoState.slice(3, 5)}-${dataNascimentoState.slice(
          0,
          2
        )}`;

        const resultado = await createAluno({
          nome,
          cpf,
          dataNascimento: dataFormatadaToNewDate,
          email,
          telefone,
          descricao,
          isAtivo: true,
        });
        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: "ALUNOS", subPage: "ALUNOS" },
        });
      }

      if (subPage.toString() === "EQUIPE") {
        const resultado = await createUsuario({
          email,
          senha,
          nome,
          isAtivo: true,
        });
        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: "ALUNOS", subPage: "EQUIPE" },
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
          <Text style={styles.title}>Criar registro</Text>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              gap: 20,
            }}
          >
            {subPage.toString() === "ALUNOS" && (
              <>
                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Nome:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setNome(text)}
                    />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>CPF:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setCpf(text)}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Data de nascimento:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setDataNascimentoState(text)}
                    />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Email:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setEmail(text)}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Telefone:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setTelefone(text)}
                    />
                  </View>
                  {/* <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Ativo:</Text>
                    Substituir por picker ou checkbox
                    <TextInput style={styles.input} value="True" />
                  </View> */}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.labelText}>Descrição:</Text>
                  <TextInput
                    style={[styles.input, { textAlignVertical: "top" }]}
                    onChangeText={(text) => setDescricao(text)}
                    multiline
                  />
                </View>

                {/* <View style={styles.row}>
              <Text style={styles.labelText}>Instrutor</Text>
              Substituir TextInput
              <TextInput
                style={styles.input}
                // value={instrutor}
                // onChangeText={setInstrutor}
                // editable={false}
              />
            </View> */}
              </>
            )}

            {subPage.toString() === "EQUIPE" && (
              <>
                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Nome:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setNome(text)}
                    />
                  </View>
                  {/* <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Ativo:</Text>
                    <TextInput style={styles.input} value="True" />
                  </View> */}
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Email:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setEmail(text)}
                    />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Senha:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setSenha(text)}
                    />
                  </View>
                </View>

                {/* <View style={styles.row}>
                  <Text style={styles.labelText}>Instrutor</Text>
                  Substituir TextInput
                  <TextInput
                    style={styles.input}
                    // value={instrutor}
                    // onChangeText={setInstrutor}
                    // editable={false}
                  />
                </View> */}
              </>
            )}
          </View>

          <Text style={styles.erroText}>{erro}</Text>

          {/* BOTÕES FINAIS */}
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
