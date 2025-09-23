// CalendarScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import MenuButton from "../../components/MenuButton";
import { getGlobalStyles } from "../../../globalStyles";
import { colors } from "../../../utils/colors";

// Configuração de idioma do calendário
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

export default function CalendarScreen() {
  const globalStyles = getGlobalStyles();
  const [selectedDay, setSelectedDay] = useState<string>("");
  type Aula = {
    id: number;
    title: string;
    students: number;
    date: string; // YYYY-MM-DD
  };

  // Exemplo de aulas vindas do banco
  const aulas: Aula[] = [
    { id: 1, title: "Pilates", students: 5, date: "2025-09-15" },
    { id: 2, title: "Yoga", students: 8, date: "2025-09-16" },
    { id: 3, title: "Alongamento", students: 6, date: "2025-09-18" },
    { id: 4, title: "Funcional", students: 4, date: "2025-09-18" },
  ];

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDayPress = (day: DateData) => {
    // Armazena no formato ISO (YYYY-MM-DD) para buscar no objeto classes
    setSelectedDay(day.dateString);
  };

  const getMarkedDates = (aulas: Aula[], selected?: string) => {
    const marked: Record<string, any> = {};

    aulas.forEach((aula) => {
      marked[aula.date] = { marked: true, dotColor: "#0033A0" };
    });

    // marca o dia selecionado
    if (selected) {
      marked[selected] = {
        ...(marked[selected] || {}),
        selected: true,
        selectedColor: "#0033A0",
      };
    }

    return marked;
  };

  // Filtra aulas do dia selecionado
  const aulasDoDia = selectedDay
    ? aulas.filter((a) => a.date === selectedDay)
    : [];

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarMainMenuOptionsContainer}>
        <MenuButton label="Listar" />
        <MenuButton label="Placeholder" />
        <MenuButton label="Placeholder" />
      </View>
      <View style={{ flex: 1, width: "100%", padding: 16 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* FEAT ME: substituir por <Agenda/> */}
          <Calendar
            enableSwipeMonths={true}
            // renderHeader server pra mudar o que é renderizado no cabeçalho
            // renderHeader={date => <Text>{date.toString()}</Text>}
            onDayPress={handleDayPress}
            markedDates={getMarkedDates(aulas, selectedDay)}
            theme={{
              todayTextColor: "white",
              todayBackgroundColor: colors.main,
              textDayFontWeight: 600,
              arrowColor: "#000000ff",
              selectedDayBackgroundColor: "#0033A0",
              selectedDayTextColor: "#fff",
            }}
            style={{
              flex: 1,
              borderRadius: 20,
              overflow: "hidden",
              padding: 16,
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {selectedDay
              ? `Aulas em ${formatDate(selectedDay)}`
              : "Selecione um dia"}
          </Text>
          <View style={{ flex: 1 }}>
            <ScrollView>
              {aulasDoDia.length > 0 ? (
                aulasDoDia.map((c) => (
                  <View key={c.id} style={styles.classCard}>
                    <Text style={styles.classTitle}>{c.title}</Text>
                    <Text style={styles.classSub}>{c.students} alunos</Text>
                    <Text style={styles.classSub}>{c.date}</Text>
                  </View>
                ))
              ) : selectedDay ? (
                <Text style={styles.noClass}>Nenhuma aula</Text>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </View>
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
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
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
