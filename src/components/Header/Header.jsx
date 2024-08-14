import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import hotelLogo from "../../images/hotelLogo.png";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img className={styles.logo} src={hotelLogo} alt="hotelLogo" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
