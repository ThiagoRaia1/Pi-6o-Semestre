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
import { useAuth } from "../../../context/AuthProvider";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { useFadeSlide } from "../../../hooks/useFadeSlide";
import { IAluno } from "../../../interfaces/aluno";
import { colors } from "../../../utils/colors";
import { IUser } from "../../../interfaces/user";
import { formatDateToBR } from "../../../utils/formatDate";

type EditRegister = {
  item: IAluno | IUser | null;
  openCloseModal: () => void;
};

export default function EditRegister({ item, openCloseModal }: EditRegister) {
  const { token, nome } = useAuth();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();

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
          <Text style={styles.title}>Editar</Text>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              gap: 20,
            }}
          >
            {item && !("senha" in item) ? (
              <>
                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Nome:</Text>
                    <TextInput style={styles.input} value={item?.nome} />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>CPF:</Text>
                    <TextInput style={styles.input} value={item.cpf} />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Data de nascimento:</Text>
                    <TextInput
                      style={styles.input}
                      value={formatDateToBR(item.dataNascimento)}
                    />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Email:</Text>
                    <TextInput style={styles.input} value={item.email} />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Telefone:</Text>
                    <TextInput style={styles.input} value={item.telefone} />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Ativo:</Text>
                    {/* Substituir por picker ou checkbox */}
                    <TextInput style={styles.input} value="True" />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.labelText}>Descrição:</Text>
                  <TextInput
                    style={[styles.input, { textAlignVertical: "top" }]}
                    value={item.descricao}
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
            ) : (
              <>
                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Nome:</Text>
                    <TextInput style={styles.input} value={item?.nome} />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Ativo:</Text>
                    <TextInput style={styles.input} value="True" />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Email:</Text>
                    <TextInput style={styles.input} value={item?.email} />
                  </View>
                  <View style={styles.rowColunm}>
                    <Text style={styles.labelText}>Senha:</Text>
                    <TextInput style={styles.input} value={item?.senha} />
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
              onPress={() => {}}
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
