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
import { colors } from "../utils/colors";
import MenuButton from "../components/MenuButton";
import { useFadeSlide } from "../hooks/useFadeSlide";
import { useEffect, useMemo, useState } from "react";
import { formatDateToBR } from "../utils/formatDate";
import { useAuth } from "../context/AuthProvider";
import { Picker } from "@react-native-picker/picker";
import { createAula, getAulas, getAulasRegistradas } from "../services/aulas";
import { decodeToken } from "../utils/decodeToken";
import Loading from "../components/Loading";
import { router } from "expo-router";
import { pagePathnames, pageNames } from "../utils/pageNames";
import { getAlunos } from "../services/alunos";
import { IAluno } from "../interfaces/aluno";
import { useBreakpoint } from "../hooks/useBreakpoint";

type RegistrarAulaProps = {
  data: string;
  openCloseModal: () => void;
};

export default function RegistrarAula({
  data,
  openCloseModal,
}: RegistrarAulaProps) {
  const { token, nome } = useAuth();
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const { isLaptop, isDesktop } = useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState(" ");
  const [instrutor, setInstrutor] = useState<string>(nome || "");
  const [selectedHora, setSelectedHora] = useState("07:00");
  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [aulasRegistradas, setAulasRegistradas] = useState<string[]>([]);

  const horasDisponiveis = Array.from({ length: 12 }, (_, i) => {
    const hora = i + 7;
    return `${hora.toString().padStart(2, "0")}:00`;
  });

  useEffect(() => {
    const loadData = async () => {
      setAlunos(await getAlunos());
      const resultadoAulasRegistradas = await getAulasRegistradas(data);
      setAulasRegistradas(resultadoAulasRegistradas);
    };
    loadData();
    fadeIn(500);
  }, []);

  useEffect(() => {
    // Assim que os horários registrados são carregados, definimos o primeiro horário livre
    if (aulasRegistradas.length >= 0) {
      const horasCheias = aulasRegistradas.map(
        (d) => new Date(d).getHours().toString().padStart(2, "0") + ":00"
      );
      const horasLivres = horasDisponiveis.filter(
        (hora) => !horasCheias.includes(hora)
      );
      if (horasLivres.length > 0) {
        setSelectedHora(horasLivres[0]); // define automaticamente o primeiro disponível
      } else {
        setSelectedHora(""); // nenhum horário livre
      }
    }
  }, [aulasRegistradas]);

  // Remove os horários que já estão cheios
  const horasDisponiveisFiltradas = useMemo(() => {
    const horasCheias = aulasRegistradas.map(
      (d) => new Date(d).getHours().toString().padStart(2, "0") + ":00"
    );
    return horasDisponiveis.filter((hora) => !horasCheias.includes(hora));
  }, [aulasRegistradas]);

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

  const agendarAula = async () => {
    try {
      setIsLoading(true);
      setErro(" ");

      const dataCompleta = new Date(`${data}T${selectedHora}`);

      if (alunosSelecionados.length === 0) {
        setErro("Selecione ao menos um aluno para registrar a aula.");
        return;
      }

      if (token) {
        const decoded = await decodeToken(token);
        await createAula(dataCompleta, decoded, alunosSelecionados);
        await getAulas();

        alert("Aula registrada com sucesso!");
        openCloseModal();
        router.push({
          pathname: pagePathnames.pages,
          params: { pageName: pageNames.agenda.main, subPage: "AGENDAR AULA" },
        });
      }
    } catch (erro: any) {
      setErro(erro.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      marginBottom: 10,
    },
    selecionadoChip: {
      backgroundColor: colors.buttonMainColor,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
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
            gap: 10,
          }}
        >
          <Text
            style={{ fontSize: 26, fontWeight: "600", textAlign: "center" }}
          >
            {`Registrar Aula - ${formatDateToBR(new Date(data))}`}
          </Text>

          {/* SEÇÃO HORÁRIO E INSTRUTOR */}
          <View style={{ flexDirection: "row", marginTop: 10, gap: 20 }}>
            <View style={styles.section}>
              <Text style={styles.labelText}>Horário</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedHora}
                  onValueChange={(itemValue) => setSelectedHora(itemValue)}
                  dropdownIconColor="#555"
                  style={styles.picker}
                >
                  {horasDisponiveisFiltradas.map((hora) => (
                    <Picker.Item key={hora} label={hora} value={hora} />
                  ))}
                </Picker>
              </View>
            </View>

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
                    <Text style={styles.selecionadoTexto}>{aluno.nome}</Text>
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
                    <Text style={styles.alunoNome}>{item.nome}</Text>
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
              onPress={agendarAula}
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
