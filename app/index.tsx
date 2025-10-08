import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { getGlobalStyles } from "../globalStyles";
import { useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { pageNames, pagePathnames } from "../utils/pageNames";
import { router } from "expo-router";
import { colors } from "../utils/colors";
import { breakpoints } from "../utils/breakpoints";
import { ILoginResponse, Login as LoginApi } from "../services/auth/login";
import { useAuth } from "../context/AuthProvider";
import DefaultProfileIcon from "../components/DefaultProfileIcon";
import Loading from "../components/Loading";

export default function Login() {
  const { login, logout } = useAuth();
  const width: number = useWindowDimensions().width;
  const isLaptop: boolean = width >= breakpoints.laptop;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const globalStyles = getGlobalStyles();
  const textMainColor: string = "white";
  const textInputMainColor: string = "black";

  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [isSenhaVisible, setIsSenhaVisible] = useState<boolean>(true);

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
      backgroundColor: colors.main,
      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.6)",
      borderTopLeftRadius: isLaptop ? 20 : 0,
      borderBottomLeftRadius: isLaptop ? 20 : 0,
      alignItems: "center",
    },
    loginItemsContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      marginBottom: 30,
      maxWidth: 500,
    },
    label: {
      width: "100%",
      color: textMainColor,
      fontSize: 22,
      fontWeight: 600,
      marginLeft: 10,
    },
    labelInputContainer: {
      width: "100%",
      alignItems: "center",
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
      marginTop: 20,
      borderRadius: 10,
      backgroundColor: "#08306B",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: textMainColor,
      fontWeight: 700,
      fontSize: 18,
    },
  });

  useEffect(() => {
    logout();
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const loginData: ILoginResponse = await LoginApi({ email, senha });
      login(loginData.access_token, loginData.nome);
      // alert(`retorno do login: ${loginData.access_token}`)
      // alert(`retorno do login: ${loginData.nome}`)
      router.push({
        pathname: pagePathnames.pages,
        params: { pageName: pageNames.agenda.main, subPage: "AGENDAR AULA" },
      });
    } catch (erro: any) {
      if (erro.message === "Failed to fetch") {
        alert("Não foi possível conectar-se ao serviço de login");
        return;
      }
      alert(erro.message);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[globalStyles.container, { flexDirection: "row" }]}>
      {isLaptop && (
        <Image
          source={require("../assets/LoginMainImage.png")}
          resizeMode="center"
          style={{ flex: 5 }}
        />
      )}

      <View style={styles.loginContainer}>
        <View style={styles.loginItemsContainer}>
          <DefaultProfileIcon size={100} />
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
                secureTextEntry={isSenhaVisible}
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                }}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => {
                  setIsSenhaVisible(!isSenhaVisible);
                }}
              >
                <FontAwesome5
                  name={isSenhaVisible ? "eye" : "eye-slash"}
                  size={24}
                  color={"#d581a1"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && <Loading />}
    </View>
  );
}
