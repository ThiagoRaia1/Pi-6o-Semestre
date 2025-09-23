import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";

export default function Layout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    )
}