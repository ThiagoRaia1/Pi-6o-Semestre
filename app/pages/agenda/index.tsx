import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { getGlobalStyles } from "../../../globalStyles";
import { colors } from "../../../utils/colors";
import { getAulas } from "../../../services/aulas";
import { IAula } from "../../../interfaces/aula";
import { DateDataToString, formatDateToBR } from "../../../utils/formatDate";
import Feather from "@expo/vector-icons/Feather";
import { useFadeSlide } from "../../../hooks/useFadeSlide";
import RegistrarAula from "./RegistrarAula";
import Loading from "../../../components/Loading";
import MenuButton from "../../../components/MenuButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import NextClasses from "./nextClasses";
import TopBar from "../../../components/TopBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { gerarPlanoDeAula } from "../../../services/groq";
import EditClass from "./editClass";
import { IAluno } from "../../../interfaces/aluno";
import { getAlunos } from "../../../services/alunos";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { IPlanoDeAula } from "../../../interfaces/planoDeAula";
import { createPlanoDeAula } from "../../../services/planoDeAula";
import SetPlanoDeAulaModal from "./SetPlanoDeAulaModal";

type AgendaProps = {
  onToggleNextClasses?: (visible: boolean) => void;
};

export default function Agenda({ onToggleNextClasses }: AgendaProps) {
  const { fadeAnim, slideAnim, fadeIn } = useFadeSlide();
  const globalStyles = getGlobalStyles();
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split("T")[0] // "YYYY-MM-DD"
  );
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [alunos, setAlunos] = useState<IAluno[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAgendarModalVisible, setIsAgendarModalVisible] =
    useState<boolean>(false);

  const [isNextClassesVisible, setIsNextClassesVisible] =
    useState<boolean>(false);

  const [isEditClassVisible, setIsEditClassVisible] = useState<boolean>(false);
  const [aulaSelecionada, setAulaSelecionada] = useState<IAula | null>(null);

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState<boolean>(false);

  const [isModalSetPlanoDeAulaVisible, setIsModalSetPlanoDeAulaVisible] =
    useState<boolean>(false);

  const [planoGerado, setPlanoGerado] = useState<string>("");

  const iconSize: number = 24;

  LocaleConfig.locales["pt-br"] = {
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    dayNames: [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje",
  };

  // Define o locale ativo
  LocaleConfig.defaultLocale = "pt-br";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getAulas();
        // opcional: validar formato de cada aula aqui
        setAulas(result);
        // console.log("Aulas carregadas:", result);

        const getAlunosResult = await getAlunos();
        setAlunos(getAlunosResult);
      } catch (erro: any) {
        alert(erro?.message ?? "Erro ao carregar aulas");
      } finally {
        setIsLoading(false);
        fadeIn(); // entra animado
        // return () => fadeOut(); // sai animado
      }
    };
    fetchData();
  }, []);

  // memoiza markedDates para não recriar a cada render
  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};
    aulas.forEach((aula) => {
      if (!aula || !aula.data) return;
      const key = DateDataToString(aula.data);
      if (!key) return;
      marked[key] = { marked: true, dotColor: "#0033A0" };
    });

    if (selectedDay) {
      marked[selectedDay] = {
        ...(marked[selectedDay] || {}),
        selected: true,
        selectedColor: "#0033A0",
      };
    }

    return marked;
  }, [aulas, selectedDay]);

  // memoriza filtro de aulas do dia
  const aulasDoDia = useMemo(() => {
    if (!selectedDay) return [];

    return aulas
      .filter((a) => {
        const key = a?.data ? DateDataToString(a.data) : null;
        return key === selectedDay;
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()); // Ordena do horario mais cedo para o mais tarde
  }, [aulas, selectedDay]);

  const openCloseAgendarModal = () => {
    setIsAgendarModalVisible(!isAgendarModalVisible);
  };

  const openCloseNextClasses = () => {
    const newValue = !isNextClassesVisible;
    setIsNextClassesVisible(newValue);
    onToggleNextClasses?.(newValue); // avisa o MainPage
  };

  const openCloseEditClass = () => {
    setIsEditClassVisible(!isEditClassVisible);
  };

  const openCloseConfirmationModal = (aulaId?: number) => {
    setAulaSelecionada((prev) => {
      if (aulaId && (!prev || prev.id !== aulaId)) {
        const aula = aulas.find((a) => a.id === aulaId) || null;
        return aula;
      }
      return prev;
    });
    setIsConfirmationModalVisible((prev) => !prev);
  };

  const openCloseSetPlanoDeAulaModal = () => {
    setIsModalSetPlanoDeAulaVisible(!isModalSetPlanoDeAulaVisible);
  };

  const styles = StyleSheet.create({
    title: {
      fontWeight: "300",
      fontSize: 24,
      marginBottom: 12,
      marginTop: -12,
    },
    classCard: {
      backgroundColor: "white",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#aaa",
    },
    classTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#0033A0",
    },
    classSub: {
      color: "#555",
      marginTop: 4,
    },
    noClass: {
      color: "#888",
      marginTop: 10,
      fontStyle: "italic",
    },
    button: {
      flexDirection: "row",
      gap: 20,
      backgroundColor: colors.buttonMainColor,
      paddingVertical: 5,
      paddingHorizontal: 10,
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 10,
    },
    buttonText: {
      fontSize: 16,
      color: "white",
      fontWeight: 500,
    },
  });

  const planClass = async (aula: IAula) => {
    try {
      setIsLoading(true);
      console.log(aula);

      if (aula.alunos.length === 0) {
        throw new Error("Registre pelo menos 1 aluno na aula para planejá-la.");
      }

      const descricoes = aula.alunos.map((aluno) => {
        return aluno.descricao;
      });

      console.log(descricoes);

      const plano = await gerarPlanoDeAula(descricoes);

      setPlanoGerado(plano);

      setIsModalSetPlanoDeAulaVisible(true);

      const planoDeAula: IPlanoDeAula = await createPlanoDeAula({
        plano,
        salvo: false,
      });

      // await updateAula(aula.id, { planoDeAula });

      // FEAT ME:
      // Adicionar modal pedindo a confirmação se o plano de aula gerado deve ser adicionado a aula

      // router.push({
      //   pathname: pagePathnames.pages,
      //   params: { pageName: pageNames.agenda.main },
      // });
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <TopBar
        menuButtons={[
          <MenuButton
            label="Registrar aula"
            onPress={openCloseAgendarModal}
            icon={{
              component: FontAwesome,
              name: "calendar",
              size: 20,
              color: "white",
            }}
          />,
          <MenuButton
            label="Próximas aulas"
            icon={{
              component: MaterialCommunityIcons,
              name: "page-next-outline",
              size: 22,
              color: "white",
            }}
            onPress={openCloseNextClasses}
          />,
          // <MenuButton
          //   label="Planejar aula"
          //   icon={{
          //     component: MaterialCommunityIcons,
          //     name: "robot-excited-outline",
          //     size: iconSize,
          //     color: "white",
          //   }}
          // />,
        ]}
      />

      <Animated.View
        style={[
          globalStyles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingBottom: 16,
          },
        ]}
      >
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
          <Calendar
            enableSwipeMonths={true}
            onDayPress={(datePressed) => {
              // console.log(aulas);
              setSelectedDay(datePressed.dateString);
            }}
            markedDates={markedDates}
            customHeader={(props: any) => {
              const diasDaSemana = [
                "Dom",
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sáb",
              ];
              return (
                <View>
                  {/* Header com setas e mês */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 75,
                      alignItems: "center",
                      marginBottom: 32,
                    }}
                  >
                    <Feather
                      name="chevron-left"
                      size={iconSize}
                      color="black"
                      onPress={() => props.addMonth(-1)}
                    />
                    <Text
                      style={{
                        fontSize: 22,
                        color: colors.main,
                      }}
                      selectable={false}
                    >
                      {props.month.toString("MMMM yyyy")}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={iconSize}
                      color="black"
                      onPress={() => props.addMonth(1)}
                    />
                  </View>

                  {/* Dias da semana */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    {diasDaSemana.map((dia) => (
                      <Text
                        key={dia}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          fontWeight: "600",
                          color: "#555",
                        }}
                      >
                        {dia}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            }}
            theme={{
              todayTextColor: "white",
              todayBackgroundColor: colors.main,

              textDayFontWeight: "600",

              selectedDayBackgroundColor: "#0033A0",
              selectedDayTextColor: "#fff",
            }}
            renderArrow={(direction) => (
              <Feather
                name={`chevron-${direction}`}
                size={20}
                color="black"
                style={{ marginHorizontal: 20 }}
              />
            )}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              paddingVertical: 32,
            }}
          />
        </View>

        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.title}>
            {`Aulas em: ${selectedDay && formatDateToBR(selectedDay)}`}
          </Text>
          <ScrollView contentContainerStyle={{ gap: 10 }}>
            {aulasDoDia.length > 0 ? (
              aulasDoDia.map((aula) => (
                <View key={aula.id} style={styles.classCard}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 40,
                      height: 200,
                    }}
                  >
                    <View>
                      {/* horário da aula */}
                      <Text style={styles.classTitle}>
                        {new Date(aula.data).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>

                      <Text>{`Instrutor: ${aula.usuario.nome}`}</Text>
                      {/* lista de alunos */}
                      {aula.alunos && aula.alunos.length > 0 ? (
                        aula.alunos.map((aluno) => (
                          <Text key={aluno.id} style={styles.classSub}>
                            {aluno.nome}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.classSub}>Nenhum aluno</Text>
                      )}
                    </View>

                    <View
                      style={{
                        flex: 1,
                        height: "100%",
                        gap: 5,
                      }}
                    >
                      <Text style={styles.classTitle}>Plano de aula</Text>
                      <ScrollView
                        style={{
                          borderWidth: 1,
                          padding: 10,
                          borderColor: "#ccc",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{ color: aula.planoDeAula ? "black" : "#555" }}
                        >
                          {aula.planoDeAula
                            ? aula.planoDeAula.plano
                            : "Nenhum plano de aula selecionado."}
                        </Text>
                      </ScrollView>
                    </View>

                    <View style={{ gap: 10 }}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                          setAulaSelecionada(aula);
                          setIsEditClassVisible(true);
                        }}
                      >
                        <Text style={styles.buttonText}>Editar</Text>
                        <Feather name="edit" size={iconSize} color="white" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                          setAulaSelecionada(aula);
                          planClass(aula);
                        }}
                      >
                        <Text style={styles.buttonText}>Planejar aula</Text>
                        <MaterialCommunityIcons
                          name="robot-excited-outline"
                          size={iconSize}
                          color="white"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.button,
                          { backgroundColor: colors.cancelColor },
                        ]}
                        onPress={() => {
                          openCloseConfirmationModal(aula.id);
                        }}
                      >
                        <Text style={styles.buttonText}>Excluir aula</Text>
                        <Ionicons
                          name="trash-outline"
                          size={iconSize}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noClass}>Nenhuma aula</Text>
            )}
          </ScrollView>
        </View>
      </Animated.View>

      {isLoading && <Loading />}

      {/* MODAIS */}
      {isAgendarModalVisible && (
        <RegistrarAula
          data={selectedDay}
          alunosRegistrados={alunos}
          openCloseModal={openCloseAgendarModal}
        />
      )}

      {isNextClassesVisible && (
        <NextClasses
          aulas={aulas}
          alunosData={alunos}
          closeModal={openCloseNextClasses}
        />
      )}

      {isEditClassVisible && aulaSelecionada && (
        <EditClass
          aula={aulaSelecionada}
          alunosData={alunos}
          openCloseModal={openCloseEditClass}
        />
      )}

      {isConfirmationModalVisible && aulaSelecionada && (
        <ConfirmationModal
          aula={aulaSelecionada}
          openCloseModal={() => openCloseConfirmationModal(aulaSelecionada.id)}
        />
      )}

      {isModalSetPlanoDeAulaVisible && (
        <SetPlanoDeAulaModal
          openCloseModal={openCloseSetPlanoDeAulaModal}
          planoGerado={planoGerado}
          aulaId={aulaSelecionada?.id}
        />
      )}
    </View>
  );
}
