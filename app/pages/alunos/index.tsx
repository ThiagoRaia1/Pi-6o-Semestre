import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
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

export default function Alunos() {
  const { fadeAnim, slideAnim, fadeIn, fadeOut } = useFadeSlide();
  const globalStyles = getGlobalStyles();

  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const [filteredAlunos, setFilteredAlunos] = useState<IAluno[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { subPage } = useLocalSearchParams();

  const tableHeadAlunos = [
    "Nome",
    "CPF",
    "Data de Nascimento",
    "Email",
    "Telefone",
  ];

  const tableHeadUsuarios = ["Email", "Nome"];

  const tableHead =
    subPage === pageNames.equipe ? tableHeadUsuarios : tableHeadAlunos;

  const tableData =
    subPage === pageNames.equipe
      ? filteredUsers.map((u) => [u.email, u.nome])
      : filteredAlunos.map((a) => [
          a.nome,
          a.cpf,
          formatDateToBR(a.dataNascimento),
          a.email,
          a.telefone,
        ]);

  const tableTitle =
    subPage === pageNames.equipe ? "Tabela de Instrutores" : "Tabela de Alunos";

  const placeholderText =
    subPage === pageNames.equipe
      ? "Pesquisar por nome ou e-mail..."
      : "Pesquisar por nome, e-mail ou CPF...";

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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (subPage === pageNames.alunos) {
      const filtered = alunos.filter(
        (a) =>
          a.nome.toLowerCase().includes(searchText.toLowerCase()) ||
          a.email.toLowerCase().includes(searchText.toLowerCase()) ||
          a.cpf.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredAlunos(filtered);
    } else if (subPage === pageNames.equipe) {
      const filtered = users.filter(
        (u) =>
          u.nome?.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchText, subPage]);

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

  const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.main,
      height: 40,
      width: "100%",
    },
    headerText: {
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
      padding: 10,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colors.main,
      borderRadius: 8,
      padding: 16,
      width: "100%",
      backgroundColor: "white",
    },
    tableTitle: {
      fontSize: 32,
      fontWeight: "200",
      textAlign: "center",
      marginTop: 10,
    },
  });

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.topBarMainMenuOptionsContainer}>
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
        />
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
    </View>
  );
}
