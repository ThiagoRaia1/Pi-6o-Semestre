import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { getGlobalStyles } from "../../../globalStyles";
import { getAlunos } from "../../../services/alunos";
import React, { useEffect, useState } from "react";
import { IAluno } from "../../../interfaces/aluno";
import { formatDateToBR } from "../../../utils/formatDate";
import { colors } from "../../../utils/colors";
import { router, useLocalSearchParams } from "expo-router";
import { pageNames } from "../../../utils/pageNames";
import { useFadeSlide } from "../../../hooks/useFadeSlide";
import Loading from "../../../components/Loading";
import MenuButton from "../../../components/MenuButton";
import { IUser } from "../../../interfaces/user";
import { getUsers } from "../../../services/usuarios";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TopBar from "../../../components/TopBar";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import EditRegister from "./editRegister";
import ConfirmationModal from "../../../components/ConfirmationModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Alunos() {
  const { fadeAnim, slideAnim, fadeIn, fadeOut } = useFadeSlide();
  const globalStyles = getGlobalStyles();

  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const [selectedItem, setSelectedItem] = useState<IAluno | IUser | null>(null);

  const [filteredAlunos, setFilteredAlunos] = useState<IAluno[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);

  const [selectedFilter, setSelectedFilter] = useState<
    "Ativos" | "Desativados" | "Todos"
  >("Todos");
  const [isFilterOptionsVisible, setIsFilterOptionsVisible] = useState(false);

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState<boolean>(false);

  const { subPage } = useLocalSearchParams();

  const { isMobile, isDesktop, isLaptop } = useBreakpoint();

  const ativoDesativoIconSize: number = 36;

  const openCloseEditRegister = (item?: IAluno | IUser) => {
    if (item) {
      setSelectedItem(item); // seta o aluno ou usuário selecionado
    }
    setIsEditVisible((prev) => !prev); // abre/fecha o modal
  };

  const openCloseConfirmationModal = (item?: IAluno | IUser) => {
    if (item) {
      setSelectedItem(item); // seta o aluno ou usuário selecionado
    }
    setIsConfirmationModalVisible((prev) => !prev);
  };

  const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.main,
      height: 40,
      width: "100%",
    },
    headerText: {
      fontSize: isMobile ? 12 : 16,
      textAlign: "center",
      fontWeight: "bold",
      color: "white",
    },
    rowData: {
      width: "100%",
      backgroundColor: "white",
    },
    rowText: {
      textAlign: "center",
      fontSize: isMobile ? 12 : 16,
      padding: 10,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colors.main,
      borderRadius: 8,
      padding: 12,
      width: "100%",
      backgroundColor: "white",
    },
    tableTitle: {
      fontSize: 32,
      fontWeight: "200",
      textAlign: "center",
    },
  });

  const tableHeadAlunos = [
    "Nome",
    "CPF",
    "Data de Nascimento",
    "Email",
    "Telefone",
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        padding: 4,
        borderRadius: 6,
      }}
    >
      <Text style={styles.headerText}>{selectedFilter}</Text>
      <TouchableOpacity
        style={{
          marginLeft: 6,
          padding: 4,
          backgroundColor: "#ffffff30",
          borderRadius: 6,
        }}
        onPress={() => setIsFilterOptionsVisible(!isFilterOptionsVisible)}
      >
        <Feather name="filter" size={18} color="white" />
      </TouchableOpacity>
    </View>,
    "Ação",
  ];

  const tableHeadUsuarios = [
    "Email",
    "Nome",
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        padding: 4,
        borderRadius: 6,
      }}
    >
      <Text style={styles.headerText}>{selectedFilter}</Text>
      <TouchableOpacity
        style={{
          marginLeft: 6,
          padding: 4,
          backgroundColor: "#ffffff30",
          borderRadius: 6,
        }}
        onPress={() => setIsFilterOptionsVisible(!isFilterOptionsVisible)}
      >
        <Feather name="filter" size={18} color="white" />
      </TouchableOpacity>
    </View>,
    "Ação",
  ];

  const tableHead =
    subPage === pageNames.equipe ? tableHeadUsuarios : tableHeadAlunos;

  const renderEditDeleteContainer = (item: IUser | IAluno) => {
    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            openCloseEditRegister(item);
          }}
        >
          <Feather
            name="edit"
            size={24}
            color="white"
            style={{
              padding: 5,
              backgroundColor: colors.buttonMainColor,
              borderRadius: 10,
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            openCloseConfirmationModal(item);
          }}
        >
          {item && "email" in item && item.isAtivo ? (
            <Ionicons
              name="trash-outline"
              size={24}
              color="white"
              style={{
                padding: 5,
                backgroundColor: colors.cancelColor,
                borderRadius: 10,
                alignSelf: "center",
              }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-reactivate-outline"
              size={24}
              color="white"
              style={{
                padding: 5,
                backgroundColor: colors.buttonMainColor,
                borderRadius: 10,
                alignSelf: "center",
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const tableData =
    subPage === pageNames.equipe
      ? filteredUsers.map((user) => [
          user.email,
          user.nome,
          user.isAtivo ? (
            <FontAwesome
              name="check-square"
              size={ativoDesativoIconSize}
              color="green"
              style={{ alignSelf: "center" }}
            />
          ) : (
            <FontAwesome
              name="minus-square"
              size={ativoDesativoIconSize}
              color={colors.cancelColor}
              style={{ alignSelf: "center" }}
            />
          ),
          renderEditDeleteContainer(user),
        ])
      : filteredAlunos.map((aluno) => [
          aluno.nome,
          aluno.cpf,
          formatDateToBR(aluno.dataNascimento),
          aluno.email,
          aluno.telefone,
          aluno.isAtivo ? (
            <FontAwesome
              name="check-square"
              size={ativoDesativoIconSize}
              color="green"
              style={{ alignSelf: "center" }}
            />
          ) : (
            <FontAwesome
              name="minus-square"
              size={ativoDesativoIconSize}
              color={colors.cancelColor}
              style={{ alignSelf: "center" }}
            />
          ),
          renderEditDeleteContainer(aluno),
        ]);

  const tableTitle =
    subPage === pageNames.equipe ? "Tabela de Instrutores" : "Tabela de Alunos";

  const placeholderText =
    subPage === pageNames.equipe
      ? "Pesquisar por nome ou e-mail..."
      : "Pesquisar por nome, e-mail ou CPF...";

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const listaAlunos: IAluno[] = await getAlunos();
        setAlunos(listaAlunos);
        setFilteredAlunos(listaAlunos);

        const listaUsers = await getUsers();
        setUsers(listaUsers);
        setFilteredUsers(listaUsers);
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        setIsLoading(false);
        fadeIn();
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (subPage === pageNames.alunos) {
      const filtered = alunos.filter((a) => {
        const matchSearch =
          a.nome.toLowerCase().includes(searchText.toLowerCase()) ||
          a.email.toLowerCase().includes(searchText.toLowerCase()) ||
          a.cpf.toLowerCase().includes(searchText.toLowerCase());

        const matchStatus =
          selectedFilter === "Todos"
            ? true
            : selectedFilter === "Ativos"
            ? a.isAtivo
            : !a.isAtivo;

        return matchSearch && matchStatus;
      });
      setFilteredAlunos(filtered);
    } else if (subPage === pageNames.equipe) {
      const filtered = users.filter((u) => {
        const matchSearch =
          u.nome?.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email.toLowerCase().includes(searchText.toLowerCase());

        const matchStatus =
          selectedFilter === "Todos"
            ? true
            : selectedFilter === "Ativos"
            ? u.isAtivo
            : !u.isAtivo;

        return matchSearch && matchStatus;
      });
      setFilteredUsers(filtered);
    }
  }, [searchText, selectedFilter, subPage]);

  const onPressListar = async (tableName: string) => {
    try {
      setIsLoading(true);
      fadeOut(100, () => {
        if (tableName === "Alunos") {
          router.setParams({ subPage: pageNames.alunos });
        }
        if (tableName === "Instrutores") {
          router.setParams({ subPage: pageNames.equipe });
        }
        fadeIn();
      });
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
            label="Listar"
            options={[
              {
                label: "Alunos",
                onPress: () => onPressListar("Alunos"),
              },
              {
                label: "Instrutores",
                onPress: () => onPressListar("Instrutores"),
              },
            ]}
            color={colors.buttonMainColor}
            icon={{ component: FontAwesome6, name: "contact-book", size: 22 }}
          />,
          <MenuButton label={`Registrar`} />,
        ]}
      />

      <Animated.View
        style={[
          globalStyles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.Text style={[styles.tableTitle, { opacity: fadeAnim }]}>
          {tableTitle}
        </Animated.Text>

        <TextInput
          style={styles.searchInput}
          placeholder={placeholderText}
          placeholderTextColor={"#aaa"}
          value={searchText}
          onChangeText={setSearchText}
        />

        <ScrollView style={{ width: "100%", borderRadius: 10 }}>
          <View>
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Row
                data={tableHead}
                style={styles.header}
                textStyle={styles.headerText}
              />
              <Rows
                data={tableData}
                style={styles.rowData}
                textStyle={styles.rowText}
              />
            </Table>
          </View>
        </ScrollView>
      </Animated.View>

      {isLoading && <Loading />}

      {isEditVisible && (
        <EditRegister
          item={selectedItem}
          openCloseModal={openCloseEditRegister}
        />
      )}

      {isConfirmationModalVisible && selectedItem && (
        <ConfirmationModal
          aluno={"descricao" in selectedItem ? selectedItem : undefined}
          usuario={"senha" in selectedItem ? selectedItem : undefined}
          openCloseModal={() => openCloseConfirmationModal(selectedItem)}
        />
      )}

      {isFilterOptionsVisible && (
        <>
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
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#eee",
                  borderRadius: 20,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  padding: 20,
                  gap: 10,
                }}
              >
                <Text style={[styles.tableTitle, { marginBottom: 20 }]}>
                  Aplicar filtro:
                </Text>
                <MenuButton
                  label="Ativos"
                  fontWeight={700}
                  color={colors.buttonMainColor}
                  maxWidth={130}
                  onPress={() => {
                    setSelectedFilter("Ativos");
                    setIsFilterOptionsVisible(!isFilterOptionsVisible);
                  }}
                />

                <MenuButton
                  label="Desativados"
                  fontWeight={700}
                  color={colors.buttonMainColor}
                  maxWidth={130}
                  onPress={() => {
                    setSelectedFilter("Desativados");
                    setIsFilterOptionsVisible(!isFilterOptionsVisible);
                  }}
                />

                <MenuButton
                  label="Todos"
                  fontWeight={700}
                  color={colors.buttonMainColor}
                  maxWidth={130}
                  onPress={() => {
                    setSelectedFilter("Todos");
                    setIsFilterOptionsVisible(!isFilterOptionsVisible);
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                  }}
                >
                  <MenuButton
                    label="Cancelar"
                    fontWeight={700}
                    color={colors.cancelColor}
                    maxWidth={130}
                    onPress={() =>
                      setIsFilterOptionsVisible(!isFilterOptionsVisible)
                    }
                  />
                </View>
              </Animated.View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}
