import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getGlobalStyles } from "../globalStyles";
import { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { pageNames, pagePathnames } from "../utils/pageNames";
import { router } from "expo-router";

export default function Login() {
  const globalStyles = getGlobalStyles();
  const textMainColor: string = "white";
  const textInputMainColor: string = "black";

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(true);

  const styles = StyleSheet.create({
    leftContainer: {
      flex: 7,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eee",
    },
    loginContainer: {
      flex: 3,
      height: "100%",
      padding: 60,
      backgroundColor: "#89B6D5",
      boxShadow: "0px 0px 20px rgba(0, 0, 0, 1)",
    },
    loginItemsContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 30,
    },
    label: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: 600,
      marginLeft: 10,
    },
    labelInputContainer: {
      width: "100%",
      gap: 5,
    },
    textInput: {
      width: "100%",
      height: 50,
      backgroundColor: "#E8F0FE",
      borderRadius: 20,
      paddingHorizontal: 16,
      color: textInputMainColor,
      fontSize: 16,
      justifyContent: "center",
      alignItems: "center",
      outlineStyle: "none" as any,
    },
    showPasswordButton: {
      borderRadius: 20,
      width: 50,
      alignItems: "center",
    },
    button: {
      width: 200,
      height: 40,
      borderRadius: 1000,
      backgroundColor: "#4086DC",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: textMainColor,
      fontWeight: 600,
      fontSize: 16,
    },
  });

  const handleLogin = () => {
    // Fazer a rota de login
    router.push({
      pathname: pagePathnames.pages,
      params: { pageName: pageNames.agenda.main, subPage: "AGENDAR AULA" },
    });
  };

  return (
    <View style={[globalStyles.container, { flexDirection: "row" }]}>
      <View style={styles.leftContainer}>
        <Text>Logo placeholder</Text>
      </View>

      <View style={styles.loginContainer}>
        <View style={styles.loginItemsContainer}>
          <View style={styles.labelInputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
          </View>

          <View style={styles.labelInputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 0,
                  paddingRight: 8,
                  flexDirection: "row",
                },
              ]}
            >
              <TextInput
                style={styles.textInput}
                secureTextEntry={passwordIsVisible}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => {
                  setPasswordIsVisible(!passwordIsVisible);
                }}
              >
                <FontAwesome5
                  name={passwordIsVisible ? "eye" : "eye-slash"}
                  size={24}
                  color={textInputMainColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
