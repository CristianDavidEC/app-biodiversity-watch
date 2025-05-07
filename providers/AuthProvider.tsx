import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthData = {
    loading: boolean;
    session: Session | null;
}

const AuthContext = createContext<AuthData>({
    loading: true,
    session: null,
});

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error fetching session:", error);
                setLoading(false);
                throw error;
            }
            if (session) {
                setSession(session);
            } else {
                router.replace("/(auth)/login");
            }
            setLoading(false);
        }

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setLoading(false);
            if (session) {
                router.replace("/(tabs)");
            } else {
                router.replace("/(auth)/login");
            }

        });

        return () => authListener?.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ loading, session }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);