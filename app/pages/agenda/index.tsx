import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import MenuButton from "../../components/MenuButton";
import { getGlobalStyles } from "../../../globalStyles";
import { colors } from "../../../utils/colors";
import { getAulas } from "../../../services/aulas";
import { IAula } from "../../../interfaces/aula";
import Loading from "../../components/Loading";
import { DateDataToString, formatDateToBR } from "../../../utils/formatDate";
import Feather from "@expo/vector-icons/Feather";
import { useFadeSlide } from "../../../hooks/useFadeSlide";

export default function Agenda() {
  const { fadeAnim, slideAnim, fadeIn, fadeOut } = useFadeSlide();
  const globalStyles = getGlobalStyles();
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    const fetchAulas = async () => {
      setIsLoading(true);
      try {
        const result = await getAulas();
        // opcional: validar formato de cada aula aqui
        setAulas(result);
        // console.log("Aulas carregadas:", result);
      } catch (erro: any) {
        alert(erro?.message ?? "Erro ao carregar aulas");
      } finally {
        setIsLoading(false);
        fadeIn(); // entra animado
        // return () => fadeOut(); // sai animado
      }
    };
    fetchAulas();
  }, []);

  // memoiza markedDates para não recriar a cada render
  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};
    aulas.forEach((aula) => {
      if (!aula || !aula.date) return;
      const key = DateDataToString(aula.date);
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
        const key = a?.date ? DateDataToString(a.date) : null;
        return key === selectedDay;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ordena do horario mais cedo para o mais tarde
  }, [aulas, selectedDay]);

  // // Safe debug (só loga se existir)
  // useEffect(() => {
  //   if (aulas.length > 0) {
  //     console.log("Primeira aula (safe):", aulas[0]);
  //   }
  //   console.log("selectedDay:", selectedDay);
  //   console.log("aulasDoDia:", aulasDoDia);
  // }, [aulas, selectedDay, aulasDoDia]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarMainMenuOptionsContainer}>
        <MenuButton label="Placeholder" />
        <MenuButton label="Placeholder" />
        <MenuButton label="Placeholder" />
      </View>

      <Animated.View
        style={[
          globalStyles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
          <Calendar
            enableSwipeMonths={true}
            onDayPress={(datePressed) => {
              console.log(aulas);
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
                      size={24}
                      color="black"
                      onPress={() => props.addMonth(-1)}
                    />
                    <Text
                      style={{
                        fontSize: 22,
                        color: colors.main,
                      }}
                    >
                      {props.month.toString("MMMM yyyy")}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={24}
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
            {`Aulas em: ${
              selectedDay
                ? formatDateToBR(new Date(selectedDay))
                : new Date().toLocaleDateString()
            }`}
          </Text>
          <ScrollView contentContainerStyle={{ paddingRight: 12 }}>
            {aulasDoDia.length > 0 ? (
              aulasDoDia.map((c) => (
                <View key={c.id} style={styles.classCard}>
                  {/* horário da aula */}
                  <Text style={styles.classTitle}>
                    {new Date(c.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>

                  <Text>{`Instrutor: ${c.usuario.name}`}</Text>
                  {/* lista de alunos */}
                  {c.alunos && c.alunos.length > 0 ? (
                    c.alunos.map((aluno) => (
                      <Text key={aluno.id} style={styles.classSub}>
                        {aluno.name}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.classSub}>Nenhum aluno</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noClass}>Nenhuma aula</Text>
            )}
          </ScrollView>
        </View>
      </Animated.View>

      {isLoading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 16,
  },
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
    marginBottom: 12,
    boxShadow: "0px, 2px, 6px, rgba(0, 0, 0, 0.1)",
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
});
