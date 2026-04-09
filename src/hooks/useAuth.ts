import { createContext, useContext } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
