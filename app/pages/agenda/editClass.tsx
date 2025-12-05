import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../../components/Loading";
import MenuButton from "../../../components/MenuButton";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { useFadeSlide } from "../../../hooks/useFadeSlide";
import { IAluno } from "../../../interfaces/aluno";
import { colors } from "../../../utils/colors";
import { formatDateToBR } from "../../../utils/formatDate";
import { IAula, IUpdateAula } from "../../../interfaces/aula";
import { updateAula } from "../../../services/aulas";
import { router } from "expo-router";
import { pagePathnames, pageNames } from "../../../utils/pageNames";
import { getGlobalStyles } from "../../../globalStyles";
import { IUpdatePlanoDeAula } from "../../../interfaces/planoDeAula";
import { updatePlanoDeAula } from "../../../services/planoDeAula";

type EditClassProps = {
  aula: IAula;
  alunosData: IAluno[];
  openCloseModal: () => void;
};

export default function EditClass({
  aula,
  alunosData,
  openCloseModal,
}: EditClassProps) {
  const globalStyles = getGlobalStyles();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(" ");
  const [instrutor, setInstrutor] = useState<string>(aula.usuario.nome || "");

  // Exibe alunos ativos + alunos já cadastrados na aula
  const alunos: IAluno[] = alunosData.filter(
    (a) => a.isAtivo || aula.alunos.some((alunoAula) => alunoAula.id === a.id)
  );

  const [alunosSelecionados, setAlunosSelecionados] = useState<number[]>(
    aula.alunos.map((aluno) => aluno.id)
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [plano, setPlano] = useState<string>(aula.planoDeAula.plano);

  // limita 5 alunos
  const toggleAluno = (id: number) => {
    setErro(" "); // limpa erro anterior
    setAlunosSelecionados((prev) => {
      if (prev.includes(id)) {
        return prev.filter((a) => a !== id);
      } else if (prev.length >= 5) {
        setErro("Você pode selecionar no máximo 5 alunos.");
        return prev;
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    const loadData = async () => {};

    loadData();
    fadeIn(500);
  }, []);

  // Filtro a lista pela pesquisa
  const filteredAlunos = useMemo(() => {
    return alunos.filter((aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alunos, searchTerm]);

  // Alunos selecionados detalhados
  const alunosSelecionadosDetalhados = useMemo(
    () => alunos.filter((a) => alunosSelecionados.includes(a.id)),
    [alunos, alunosSelecionados]
  );

  const styles = StyleSheet.create({
    section: {
      flex: 1,
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
      backgroundColor: "#fff",
      marginBottom: 10,
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
    alunoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#ccc",
      marginLeft: 3,
    },
    alunoNome: {
      fontSize: 18,
      color: "#333",
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
    selecionadosContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    selecionadoChip: {
      backgroundColor: colors.buttonMainColor,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    selecionadoTexto: {
      color: "#fff",
      fontWeight: "600",
      marginRight: 8,
    },
    removerChip: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "900",
    },
  });

  const confirmEdit = async () => {
    try {
      setIsLoading(true);

      const alunosIds: number[] = alunosSelecionados;

      console.log(alunosIds);

      const resultadoUpdateAula = await updateAula(aula.id, { alunosIds });

      const resultadoUpdatePlano = await updatePlanoDeAula(
        aula.planoDeAula.id,
        { plano }
      );

      alert("Aula atualizada com sucesso!");
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
            padding: 20,
          }}
        >
          <Text
            style={{ fontSize: 26, fontWeight: "600", textAlign: "center" }}
          >
            {`Editar Aula: ${formatDateToBR(aula.data)} - ${new Date(aula.data)
              .toLocaleTimeString()
              .slice(0, 5)}`}
          </Text>

          {/* SEÇÃO HORÁRIO E INSTRUTOR */}
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View style={styles.section}>
              <Text style={styles.labelText}>Instrutor</Text>
              <TextInput
                style={styles.input}
                value={instrutor}
                onChangeText={setInstrutor}
                editable={false}
              />
            </View>
          </View>

          {/* Alunos já selecionados */}
          <Text style={styles.labelText}>Selecionados:</Text>
          <View style={styles.selecionadosContainer}>
            {alunosSelecionadosDetalhados.length > 0 ? (
              alunosSelecionadosDetalhados.map((aluno) => (
                <TouchableOpacity
                  key={aluno.id}
                  onPress={() => toggleAluno(aluno.id)}
                >
                  <View style={styles.selecionadoChip}>
                    <Text style={styles.selecionadoTexto}>
                      {aluno.nome}
                      {!aluno.isAtivo &&
                        aula.alunos.some((a) => a.id === aluno.id) &&
                        " (desativado)"}
                    </Text>

                    <Text style={styles.removerChip}>×</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // Exibe um placeholder fixo quando não há alunos
              <Text
                style={{
                  color: "#777",
                  fontStyle: "italic",
                  fontSize: 16,
                  paddingVertical: 8,
                }}
              >
                Nenhum aluno selecionado
              </Text>
            )}
          </View>

          {/* LISTA DE ALUNOS */}
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.labelText}>Alunos</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar aluno..."
              placeholderTextColor="#777"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            <FlatList
              data={filteredAlunos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const selecionado = alunosSelecionados.includes(item.id);
                return (
                  <View style={styles.alunoItem}>
                    <Text style={styles.alunoNome}>
                      {item.nome}
                      {!item.isAtivo &&
                        aula.alunos.some((a) => a.id === item.id) &&
                        " (desativado)"}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.botaoAddRemove,
                        {
                          backgroundColor: selecionado
                            ? colors.cancelColor
                            : colors.buttonMainColor,
                        },
                      ]}
                      onPress={() => toggleAluno(item.id)}
                    >
                      <Text style={styles.botaoTexto}>
                        {selecionado ? "-" : "+"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.labelText}>Plano de Aula</Text>
            <TextInput
              defaultValue={plano}
              multiline={true}
              style={globalStyles.input}
              onChangeText={(text) => {
                setPlano(text);
              }}
            />
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
              label="Confirmar edição"
              fontWeight={700}
              color={colors.buttonMainColor}
              maxWidth={130}
              onPress={confirmEdit}
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
