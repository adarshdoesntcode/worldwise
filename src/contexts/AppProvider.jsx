import { createContext, useState, useEffect, useContext } from "react";

const SERVER_URL = "http://localhost:9000";

const AppContext = createContext();

function AppProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${SERVER_URL}/cities`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setCities(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        cities,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("using useApp outside AppProvider");
  return context;
};

export { AppProvider, useApp };
