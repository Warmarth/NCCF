import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initSession = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
