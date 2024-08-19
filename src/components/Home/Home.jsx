import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.heroSection}>
      <h1 className={styles.headlineText}>Luxury Retreat</h1>
      <Link to="/reservations">
        <h2 className={styles.heroText}>Reserve now! </h2>
      </Link>
    </div>
  );
}
