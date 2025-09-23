import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IAuthContext {
    isAuthenticated: boolean;
    name: string | null;
    login: (token: string, name: string) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    name: null,
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const loadAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            const storedName = await AsyncStorage.getItem("name");

            if (token && storedName) {
                setIsAuthenticated(true);
                setName(storedName);
            }
        };

        loadAuth();
    }, []);

    const login = async (token: string, name: string) => {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("name", name);
        setIsAuthenticated(true);
        setName(name);
    };

    const logout = async () => {
        setIsAuthenticated(false);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("name");
        setIsAuthenticated(false);
        setName(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, name, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);