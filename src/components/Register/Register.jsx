import { useState, useContext } from "react";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { HotelContext } from "../../context/hotelContext";
import { NotificationContext } from "../../context/notificationContext";

import styles from "./Register.module.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const { setUserId } = useContext(HotelContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !rePassword) {
      addNotification({
        severity: "error",
        message: "All fields are required.",
      });
      return;
    }

    if (password !== rePassword) {
      addNotification({
        severity: "error",
        message: "Passwords don't match!",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      addNotification({
        severity: "success",
        message: "Successfull registration!",
      });
      setUserId(user.uid);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.registerh2}>Register</h2>
      <div className={styles.inputs}>
        <label htmlFor="email">Email </label>
        <input
          type="email"
          value={email}
          placeholder="george@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.inputs}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={styles.inputs}>
        <label htmlFor="rePassword">Confirm Password</label>
        <input
          type="Password"
          value={rePassword}
          placeholder="********"
          onChange={(e) => setRePassword(e.target.value)}
        />
      </div>
      <button className={styles.registerBtn} onClick={handleRegister}>
        Register
      </button>
      <p className={styles.case}>
        Already have a profile?
        <Link className={styles.loginLink} to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
