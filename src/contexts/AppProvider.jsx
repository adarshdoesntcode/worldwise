import { useCallback, useEffect, useReducer } from "react";
import { AppContext } from "../hooks/useAppContext";

const SERVER_URL = "http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => {
          return city.id !== action.payload;
        }),
      };
    case "rejected":
      return { ...state, isLoading: false };
    default:
      throw new Error("unknown action type");
  }
}

function AppProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${SERVER_URL}/cities`, {
          signal: controller.signal,
        });
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        if (error.name !== "AbortError") {
          dispatch({ type: "rejected" });
          console.log(error);
        }
      }
    }
    fetchCities();
    return () => {
      controller.abort();
    };
  }, []);

  const getCity = useCallback(
    async (id) => {
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${SERVER_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        console.log(error);
        dispatch({ type: "rejected" });
      }
    },
    [currentCity.id]
  );

  const createCity = async (newCity) => {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${SERVER_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: "rejected" });
    }
  };

  const deleteCity = async (id) => {
    try {
      dispatch({ type: "loading" });

      await fetch(`${SERVER_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      console.log(error);
      dispatch({ type: "rejected" });
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
