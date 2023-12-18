import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";

function CityList({ cities }) {
  if (!cities.length) return <Message message="Add your first city" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => {
        return <CityItem city={city} key={city.id} />;
      })}
    </ul>
  );
}

export default CityList;
