import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import Spinner from "./components/Spinner";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

const SERVER_URL = "http://localhost:9000";

function App() {
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
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="product" element={<Product />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<Navigate replace to="cities" />} />
          <Route
            path="cities"
            element={isLoading ? <Spinner /> : <CityList cities={cities} />}
          />
          <Route
            path="cities/:id"
            element={isLoading ? <Spinner /> : <City />}
          />

          <Route
            path="countries"
            element={isLoading ? <Spinner /> : <CountryList cities={cities} />}
          />
          <Route path="form" element={<Form />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
