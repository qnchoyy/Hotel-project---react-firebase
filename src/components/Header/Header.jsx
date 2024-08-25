import { Link, useNavigate } from "react-router-dom";
import { HotelContext } from "../../context/hotelContext";
import { useState, useContext } from "react";

import styles from "./Header.module.css";
import logo from "../../images/logo.png";

import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { NotificationContext } from "../../context/notificationContext";

export default function Header() {
  const { userId, setUserId } = useContext(HotelContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      setUserId(null);
      addNotification({
        severity: "success",
        message: "Successfully logged out.",
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="hotelLogo" />
        </Link>
      </div>
      <button className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.showMenu : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/reviews" onClick={toggleMenu}>
              Reviews
            </Link>
          </li>
          <li>
            <Link to="/my-reservations" onClick={toggleMenu}>
              My Reservations
            </Link>
          </li>
          {!userId ? (
            <>
              <li>
                <Link to="/login" onClick={toggleMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={toggleMenu}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <button className={styles.logoutBtn} onClick={logoutHandler}>
              Logout
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
}
