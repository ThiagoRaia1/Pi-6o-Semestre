import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  ScrollView,
  Animated,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { colors } from "../../../utils/colors";
import { HoverableClassCard } from "../../components/HoverableClassCard";

/* ------------------------- Tipos / Dados ------------------------- */
type Student = {
  id: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  notes?: string;
};

type ClassSession = {
  id: string;
  title: string;
  dateIso: string; // YYYY-MM-DD
  startHour: number; // 0-23
  durationHours: number;
  students: Student[];
  instructor?: string;
};

/* ------------------------- Dados iniciais ------------------------ */
const sampleStudents: Student[] = [
  { id: "s1", name: "Ana", level: "Beginner" },
  { id: "s2", name: "Bruno", level: "Intermediate" },
  { id: "s3", name: "Carla", level: "Advanced" },
  { id: "s4", name: "Diego", level: "Beginner" },
  { id: "s5", name: "Elisa", level: "Intermediate" },
];

const todayIso = new Date().toISOString().slice(0, 10);

const initialClasses: ClassSession[] = [
  {
    id: "c1",
    title: "Aula Manhã",
    dateIso: todayIso,
    startHour: 9,
    durationHours: 1,
    students: [sampleStudents[0], sampleStudents[1]],
    instructor: "João",
  },
  {
    id: "c2",
    title: "Aula Tarde",
    dateIso: todayIso,
    startHour: 15,
    durationHours: 1.5,
    students: [sampleStudents[2], sampleStudents[3], sampleStudents[4]],
    instructor: "Maria",
  },
];

const cellsWidth: number = 170;

/* ---------------------- Helpers utilitários ---------------------- */
const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);
const isoAddDays = (iso: string, offset: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
const isoToLabel = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString();
};

/* retorna array de 7 dias começando pela segunda da semana do referenceIso */
function getWeekFrom(referenceIso: string) {
  const ref = new Date(referenceIso + "T00:00:00");
  const day = ref.getDay(); // 0 Sun ... 1 Mon
  const offsetToMonday = (day + 6) % 7;
  const mon = new Date(ref);
  mon.setDate(ref.getDate() - offsetToMonday);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

/* --------------------------- App UI ------------------------------ */
export default function Agenda() {
  const [students] = useState<Student[]>(sampleStudents);
  const [classes, setClasses] = useState<ClassSession[]>(initialClasses);

  const [weekRef, setWeekRef] = useState<string>(todayIso);
  const weekDays = useMemo(() => getWeekFrom(weekRef), [weekRef]);

  // hours shown in grid
  const hours = useMemo(() => Array.from({ length: 11 }, (_, i) => 7 + i), []);

  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [plannerVisible, setPlannerVisible] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  // sidebar
  const sidebarAnim = useRef(new Animated.Value(-400)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.parallel([
      Animated.spring(sidebarAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 80,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.6,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: -400,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => setSidebarOpen(false));
  };

  /* ------- ações: criar aula, abrir editor, adicionar/remover aluno ------- */
  const createClassAt = (dateIso: string, hour: number) => {
    const newClass: ClassSession = {
      id: uid("cls-"),
      title: "Nova Aula",
      dateIso,
      startHour: hour,
      durationHours: 1,
      students: [],
      instructor: "Instrutor",
    };
    setClasses((p) => [...p, newClass]);
    setSelectedClass(newClass);
    setEditorVisible(true);
  };

  const openClassEditor = (cls: ClassSession) => {
    setSelectedClass(cls);
    setEditorVisible(true);
  };

  const addStudentToClass = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId && !c.students.some((s) => s.id === studentId)
          ? {
              ...c,
              students: [
                ...c.students,
                students.find((s) => s.id === studentId)!,
              ],
            }
          : c
      )
    );
  };

  const removeStudentFromClass = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, students: c.students.filter((s) => s.id !== studentId) }
          : c
      )
    );
  };

  const deleteClass = (classId: string) =>
    setClasses((prev) => prev.filter((c) => c.id !== classId));

  /* ------------- gerador simples de plano de aula -------------- */
  const generatePlan = (cls: ClassSession) => {
    // contar níveis
    const count = { Beginner: 0, Intermediate: 0, Advanced: 0 } as Record<
      string,
      number
    >;
    cls.students.forEach((s) => {
      const k = s.level ?? "Beginner";
      count[k] = (count[k] || 0) + 1;
    });
    const majority = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];

    const planArr: string[] = [];
    planArr.push(`Plano automático — ${cls.title}`);
    planArr.push(
      `Data: ${isoToLabel(cls.dateIso)} • Início: ${cls.startHour}:00`
    );
    planArr.push(`Instrutor: ${cls.instructor ?? "-"}`);
    planArr.push("");
    planArr.push(
      `Perfil do grupo: ${cls.students.length} aluno(s). Maioria: ${majority}`
    );
    planArr.push("");
    planArr.push("Estrutura sugerida:");
    planArr.push("- Aquecimento: 10-12min (exercícios dinâmicos).");

    if (majority === "Beginner") {
      planArr.push(
        "- Parte principal: movimentos básicos e repetições (25min)."
      );
    } else if (majority === "Intermediate") {
      planArr.push("- Parte principal: progressões e maior variação (30min).");
    } else {
      planArr.push("- Parte principal: intensidade e condicionamento (35min).");
    }

    planArr.push("- Encerramento: alongamento e feedback (5-10min).");
    if (cls.students.length) {
      planArr.push("");
      planArr.push("Observações por aluno:");
      cls.students.forEach((s) =>
        planArr.push(
          `- ${s.name} (${s.level ?? "Beginner"}): ${
            s.notes ?? "sem observações"
          }`
        )
      );
    }

    setGeneratedPlan(planArr.join("\n"));
    setPlannerVisible(true);
  };

  /* ---------------------- helpers de render ---------------------- */
  const classesOn = (dateIso: string, hour: number) =>
    classes.filter((c) => c.dateIso === dateIso && c.startHour === hour);

  const upcoming = useMemo(
    () =>
      classes
        .slice()
        .sort((a, b) =>
          a.dateIso + a.startHour > b.dateIso + b.startHour ? 1 : -1
        )
        .slice(0, 8),
    [classes]
  );

  /* -------------------------- UI render -------------------------- */
  return (
    <SafeAreaView style={S.container}>
      {/* Header */}
      <View style={S.header}>
        <Text style={S.headerTitle}>Agendamento de Aulas</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={S.headerBtn}
            onPress={() => setWeekRef(isoAddDays(weekRef, -7))}
          >
            <Text style={S.headerBtnText}>◀ Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={S.headerBtn}
            onPress={() => setWeekRef(todayIso)}
          >
            <Text style={S.headerBtnText}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={S.headerBtn}
            onPress={() => setWeekRef(isoAddDays(weekRef, 7))}
          >
            <Text style={S.headerBtnText}>Semana ▶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[S.headerBtn, { backgroundColor: "#D581A2" }]}
            onPress={openSidebar}
          >
            <Text style={[S.headerBtnText, { color: "white" }]}>
              Próximas Aulas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={S.content}>
        {/* Left: calendar grid */}
        <ScrollView style={{ flex: 1 }}>
          <ScrollView
            horizontal
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              marginTop: 12,
              marginBottom: 48,
            }}
          >
            <View>
              {/* top row: weekday labels */}
              <View style={S.row}>
                <View style={S.timeColumnHeader} />
                {weekDays.map((d) => (
                  <View key={d} style={S.dayHeader}>
                    <Text style={S.dayHeaderText}>
                      {new Date(d).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </Text>
                  </View>
                ))}
              </View>

              {/* grid hours x days */}
              {hours.map((h) => (
                <View key={h} style={S.row}>
                  <View style={S.timeColumn}>
                    <Text style={S.timeText}>{`${String(h).padStart(
                      2,
                      "0"
                    )}:00`}</Text>
                  </View>

                  {weekDays.map((d) => {
                    const cellClasses = classesOn(d, h);
                    return (
                      <TouchableOpacity
                        key={d + h}
                        style={S.cell}
                        onPress={() => {
                          // if there's already a class, open it; otherwise create new
                          if (cellClasses.length === 1) {
                            openClassEditor(cellClasses[0]);
                          } else if (cellClasses.length > 1) {
                            // multiple classes — show choice (simple alert)
                            Alert.alert(
                              "Múltiplas aulas",
                              `Existem ${cellClasses.length} aulas nesse horário. Selecione uma:`,
                              cellClasses.map((c) => ({
                                text: c.title,
                                onPress: () => openClassEditor(c),
                              }))
                            );
                          } else {
                            createClassAt(d, h);
                          }
                        }}
                      >
                        {cellClasses.length === 0 ? (
                          <Text style={S.cellEmptyText}>+</Text>
                        ) : (
                          cellClasses.map((c) => (
                            <HoverableClassCard
                              key={c.id}
                              title={c.title}
                              instructor={c.instructor}
                              students={c.students}
                              onEdit={() => openClassEditor(c)}
                              onPlan={() => generatePlan(c)}
                            />
                          ))
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Right: small sidebar summary (desktop) */}
        {/* <View style={S.sideSummary}>
          <Text style={S.sideTitle}>Próximas aulas</Text>
          <FlatList
            data={upcoming}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={S.upItem}>
                <Text style={{ fontWeight: "700" }}>{item.title}</Text>
                <Text>
                  {isoToLabel(item.dateIso)} • {item.startHour}:00
                </Text>
                <Text style={{ color: "#666" }}>
                  {item.students.length} alunos
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            style={{ width: 260 }}
          />
        </View> */}
      </View>

      {/* Editor modal */}
      <Modal
        visible={editorVisible}
        animationType="slide"
        onRequestClose={() => setEditorVisible(false)}
      >
        <SafeAreaView style={S.modal}>
          <Text style={S.modalTitle}>Editar Aula</Text>
          {selectedClass ? (
            <>
              <Text style={S.modalSub}>{selectedClass.title}</Text>
              <Text>
                {isoToLabel(selectedClass.dateIso)} • {selectedClass.startHour}
                :00
              </Text>
              <Text style={{ marginTop: 12, fontWeight: "700" }}>
                Alunos inscritos
              </Text>

              <FlatList
                data={selectedClass.students}
                keyExtractor={(s) => s.id}
                ListEmptyComponent={
                  <Text style={{ color: "#666", marginTop: 8 }}>
                    Nenhum aluno
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={S.rowItem}>
                    <Text>
                      {item.name} — {item.level}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        removeStudentFromClass(selectedClass.id, item.id)
                      }
                    >
                      <Text style={{ color: "#e74c3c" }}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                )}
                style={{ marginTop: 8 }}
              />

              <Text style={{ marginTop: 12, fontWeight: "700" }}>
                Adicionar aluno
              </Text>
              <FlatList
                data={students}
                keyExtractor={(s) => s.id}
                renderItem={({ item }) => {
                  const already = selectedClass.students.some(
                    (x) => x.id === item.id
                  );
                  return (
                    <View style={S.rowItem}>
                      <Text style={{ color: already ? "#999" : undefined }}>
                        {item.name} • {item.level}
                      </Text>
                      {!already && (
                        <TouchableOpacity
                          onPress={() =>
                            addStudentToClass(selectedClass.id, item.id)
                          }
                        >
                          <Text style={{ color: "#2ecc71" }}>Adicionar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                }}
                style={{ marginTop: 8, maxHeight: 200 }}
              />

              <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                <TouchableOpacity
                  style={S.btn}
                  onPress={() => generatePlan(selectedClass)}
                >
                  <Text style={S.btnText}>Gerar Plano de Aula</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[S.btn, { backgroundColor: "#e74c3c" }]}
                  onPress={() => {
                    deleteClass(selectedClass.id);
                    setEditorVisible(false);
                  }}
                >
                  <Text style={S.btnText}>Excluir Aula</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[S.btn, { backgroundColor: "#aaa" }]}
                  onPress={() => setEditorVisible(false)}
                >
                  <Text style={S.btnText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </SafeAreaView>
      </Modal>

      {/* Planner modal */}
      <Modal
        visible={plannerVisible}
        animationType="slide"
        onRequestClose={() => setPlannerVisible(false)}
      >
        <SafeAreaView style={S.modal}>
          <Text style={S.modalTitle}>Plano de Aula Gerado</Text>
          <ScrollView style={{ marginTop: 12 }}>
            <Text style={{}}>{generatedPlan}</Text>
          </ScrollView>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              style={S.btn}
              onPress={() => {
                // aqui você poderia salvar o plano no servidor
                Alert.alert("Plano salvo (simulado)");
              }}
            >
              <Text style={S.btnText}>Salvar Plano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.btn, { backgroundColor: "#aaa" }]}
              onPress={() => setPlannerVisible(false)}
            >
              <Text style={S.btnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Animated overlay + Sidebar */}
      {sidebarOpen && (
        <Pressable style={S.overlayTouchable} onPress={closeSidebar}>
          <Animated.View style={[S.overlay, { opacity: overlayAnim }]} />
        </Pressable>
      )}

      <Animated.View style={[S.sidePanel, { left: sidebarAnim }]}>
        <Text style={S.sideTitle}>Próximas Aulas</Text>
        <ScrollView
          style={{
            padding: 12,
          }}
        >
          {upcoming.map((c) => (
            <View
              key={c.id}
              style={{
                marginBottom: 12,
                borderBottomWidth: 1,
                borderColor: "white",
                paddingBottom: 24,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {c.title}
              </Text>
              <Text style={{ color: "white" }}>
                {isoToLabel(c.dateIso)} • {c.startHour}:00
              </Text>
              <Text style={{ color: "#666" }}>{c.students.length} alunos</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                <TouchableOpacity
                  style={[S.btn, { flex: 1 }]}
                  onPress={() => {
                    closeSidebar();
                    openClassEditor(c);
                  }}
                >
                  <Text style={S.btnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[S.btn, { flex: 1 }]}
                  onPress={() => {
                    closeSidebar();
                    generatePlan(c);
                  }}
                >
                  <Text style={S.btnText}>Planejar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[S.btn, { marginVertical: 12, alignItems: "center" }]}
          onPress={closeSidebar}
        >
          <Text style={S.btnText}>Fechar</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

/* ----------------------------- Styles --------------------------- */
const S = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  header: {
    padding: 24,
    backgroundColor: colors.topBarColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  headerBtn: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  headerBtnText: {
    color: "#0033A0",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
  },
  timeColumnHeader: {
    width: cellsWidth,
    backgroundColor: "#fff",
  },
  dayHeader: {
    width: cellsWidth,
    padding: 8,
    backgroundColor: "#e9eef6",
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
  },
  dayHeaderText: {
    fontWeight: "700",
    textAlign: "center",
  },
  timeColumn: {
    width: cellsWidth,
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    color: "#333",
  },
  cell: {
    width: cellsWidth,
    height: 90,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 6,
    justifyContent: "center",
  },
  cellEmptyText: {
    color: "#999",
    textAlign: "center",
    fontSize: 30,
    fontWeight: 700,
  },
  classCard: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 6,
    elevation: 1,
  },
  classTitle: {
    fontWeight: "700",
  },
  classSub: {
    color: "#666",
    fontSize: 12,
  },
  actionLink: {
    color: "#1e90ff",
    fontSize: 12,
  },
  sideSummary: {
    width: 280,
    paddingLeft: 12,
  },
  sideTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  upItem: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
  },
  modal: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalSub: {
    marginTop: 6,
    fontWeight: "600",
    color: "#333",
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  btn: {
    backgroundColor: "#0033A0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "700",
  },
  overlayTouchable: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.6,
  },
  sidePanel: {
    position: "absolute",
    left: -300,
    top: 0,
    bottom: 0,
    width: 400,
    backgroundColor: colors.topBarColor,
    zIndex: 40,
    paddingTop: 20,
    paddingHorizontal: 12,
  },
});
