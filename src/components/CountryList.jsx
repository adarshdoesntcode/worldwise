import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import { useAppProvider } from "../hooks/useAppContext";

function CountryList() {
  const { cities, isLoading } = useAppProvider();
  isLoading && <Spinner />;
  if (!cities.length) return <Message message="Add your first Country" />;

  const countries = cities.reduce((array, city) => {
    if (!array.map((el) => el.country).includes(city.country))
      return [
        ...array,
        {
          emoji: city.emoji,
          country: city.country,
        },
      ];
    return array;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => {
        return <CountryItem country={country} key={country.country} />;
      })}
    </ul>
  );
}

export default CountryList;
