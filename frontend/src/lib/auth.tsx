import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getToken, setToken, removeToken } from "./api";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUsername() {
  return localStorage.getItem("username");
}

function setStoredUsername(username: string) {
  localStorage.setItem("username", username);
}

function removeStoredUsername() {
  localStorage.removeItem("username");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getToken());
    setUsernameState(getStoredUsername());
  }, []);

  const login = (jwt: string, username: string) => {
    setToken(jwt);
    setTokenState(getToken());
    setStoredUsername(username);
    setUsernameState(getStoredUsername());
  };

  const logout = () => {
    removeToken();
    setTokenState(getToken());
    removeStoredUsername();
    setUsernameState(getStoredUsername());
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
