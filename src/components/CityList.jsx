import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { Outlet } from "react-router-dom";
import Spinner from "./Spinner";
import { useApp } from "../contexts/AppProvider";

function CityList() {
  const { cities, isLoading } = useApp();

  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message="Add your first city" />;

  <Outlet />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => {
        return <CityItem city={city} key={city.id} />;
      })}
    </ul>
  );
}

export default CityList;
