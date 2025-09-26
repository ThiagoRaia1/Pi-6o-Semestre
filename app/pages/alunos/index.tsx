import { View, StyleSheet, ScrollView, TextInput } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { getGlobalStyles } from "../../../globalStyles";
import MenuButton from "../../components/MenuButton";
import { getAlunos } from "../../../services/alunos";
import React, { useEffect, useState } from "react";
import { IAluno } from "../../../interfaces/aluno";
import { formatDateToBR } from "../../../utils/formatDate";
import Loading from "../../components/Loading";
import { colors } from "../../../utils/colors";
import { router } from "expo-router";
import { pageNames } from "../../../utils/pageNames";

export default function Alunos() {
  const globalStyles = getGlobalStyles();
  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredAlunos, setFilteredAlunos] = useState<IAluno[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadAlunos = async () => {
      try {
        setIsLoading(true);
        const lista = await getAlunos();
        setAlunos(lista);
        setFilteredAlunos(lista);
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadAlunos();
  }, []);

  // Filtra alunos por nome, email ou CPF
  useEffect(() => {
    const filtered = alunos.filter(
      (a) =>
        a.name.toLowerCase().includes(searchText.toLowerCase()) ||
        a.email.toLowerCase().includes(searchText.toLowerCase()) ||
        a.cpf.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAlunos(filtered);
  }, [searchText, alunos]);

  const onPressListar = async (tableName: string) => {
    try {
      setIsLoading(true);
      if (tableName === "Alunos") {
        router.setParams({ subPage: pageNames.alunos });
        const lista = await getAlunos();
        setAlunos(lista);
        setFilteredAlunos(lista);
      }
      if (tableName === "Instrutores") {
        router.setParams({ subPage: pageNames.equipe });
        // FEAT ME: Alterar para que pegue os dados dos instrutores
        // const lista = await getAlunos();
        // setAlunos(lista);
        // setFilteredAlunos(lista);
      }
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tableHead = [
    "ID",
    "Nome",
    "CPF",
    "Data de Nascimento",
    "Email",
    "Telefone",
  ];

  const tableData = filteredAlunos.map((a) => [
    a.id,
    a.name,
    a.cpf,
    formatDateToBR(a.birthDate),
    a.email,
    a.cellphone,
  ]);

  const styles = StyleSheet.create({
    header: {
      backgroundColor: "#f1f8ff",
      height: 40,
      width: "100%",
    },
    headerText: {
      textAlign: "center",
      fontWeight: "bold",
    },
    rowData: {
      width: "100%",
    },
    rowText: {
      textAlign: "center",
      padding: 10,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 16,
      width: "100%",
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
              onPress: () => {
                onPressListar("Alunos");
              },
            },
            {
              label: "Instrutores",
              onPress: () => {
                onPressListar("Instrutores");
              },
            },
          ]}
          color={colors.buttonMainColor}
        />
        <MenuButton label="Placeholder" />
        <MenuButton label="Placeholder" />
      </View>

      <View style={[globalStyles.mainContent, { padding: 32 }]}>
        {/* Barra de pesquisa */}
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por nome, email ou CPF..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <ScrollView style={{ width: "100%" }}>
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
      </View>
      {isLoading && <Loading />}
    </View>
  );
}
