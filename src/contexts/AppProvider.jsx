import { useState, useEffect } from "react";
import { AppContext } from "../hooks/useAppContext";

const SERVER_URL = "http://localhost:9000";

function AppProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

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

  const getCity = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${SERVER_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCity = async (newCity) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${SERVER_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((prev) => [...prev, data]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCity = async (id) => {
    try {
      setIsLoading(true);
      await fetch(`${SERVER_URL}/cities/${id}`, {
        method: "DELETE",
      });

      setCities((prev) =>
        prev.filter((city) => {
          return city.id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        createCity,
        deleteCity,
        currentCity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider };
