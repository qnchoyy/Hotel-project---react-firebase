import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.heroSection}>
      <Link to="/reservations">
        <h1 className={styles.heroText}>Reserve now! </h1>
      </Link>
    </div>
  );
}
