import { createContext } from "react";
import type { User } from "@supabase/supabase-js";


export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
