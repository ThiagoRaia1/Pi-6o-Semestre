import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IAuthContext {
  isAuthenticated: boolean;
  token: string | null;
  nome: string | null;
  login: (token: string, nome: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  token: null,
  nome: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nome, setNome] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedName = await AsyncStorage.getItem("nome");

      if (token && storedName) {
        setIsAuthenticated(true);
        setToken(token);
        setNome(storedName);
      }
    };

    loadAuth();
  }, []);

  const login = async (token: string, nome: string) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("nome", nome);
    setIsAuthenticated(true);
    setToken(token);
    setNome(nome);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("nome");
    setIsAuthenticated(false);
    setToken(null);
    setNome(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, nome, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
