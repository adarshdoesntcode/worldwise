import { createContext, useContext } from "react";

export const AuthContext = createContext();

export function useAuthProvider() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth used outside of the provider");
  return context;
}
