import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import Spinner from "./components/Spinner";

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
          <Route
            index
            element={isLoading ? <Spinner /> : <CityList cities={cities} />}
          />
          <Route
            path="cities"
            element={isLoading ? <Spinner /> : <CityList cities={cities} />}
          />
          <Route path="countries" element={<p>Countries</p>} />
          <Route path="form" element={<p>Form</p>} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
