import { createContext, useContext } from "react";

export const AppContext = createContext();

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("using useApp outside AppProvider");
  return context;
};
