"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as auth from "@/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(auth.getSession());
    setReady(true);
  }, []);

  const signIn = useCallback(async (v) => { const u = await auth.signIn(v); setUser(u); return u; }, []);
  const signUp = useCallback(async (v) => { const u = await auth.signUp(v); setUser(u); return u; }, []);
  const signOut = useCallback(() => { auth.signOut(); setUser(null); }, []);

  return <AuthContext.Provider value={{ user, ready, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
