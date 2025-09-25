import { View, StyleSheet, ScrollView, TextInput } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { getGlobalStyles } from "../../../globalStyles";
import MenuButton from "../../components/MenuButton";
import { getAlunos } from "../../../services/alunos";
import React, { useEffect, useState } from "react";
import { IAluno } from "../../../interfaces/aluno";
import { formatDateToBR } from "../../../utils/formatDate";

export default function Alunos() {
  const globalStyles = getGlobalStyles();
  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredAlunos, setFilteredAlunos] = useState<IAluno[]>([]);

  useEffect(() => {
    const loadAlunos = async () => {
      const lista = await getAlunos();
      setAlunos(lista);
      setFilteredAlunos(lista);
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

  const onPressListar = async () => {
    const lista = await getAlunos();
    setAlunos(lista);
    setFilteredAlunos(lista);
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
        <MenuButton label="Listar" onPress={onPressListar} />
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
    </View>
  );
}
