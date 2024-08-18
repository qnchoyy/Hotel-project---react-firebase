import { Link, useNavigate } from "react-router-dom";
import { HotelContext } from "../../context/hotelContext";

import styles from "./Header.module.css";
import hotelLogo from "../../images/hotelLogo.png";

import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { NotificationContext } from "../../context/notificationContext";

export default function Header() {
  const { userId, setUserId } = useContext(HotelContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

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
            <Link to="/my-reservations">My Reservations</Link>
          </li>
          {!userId ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
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
