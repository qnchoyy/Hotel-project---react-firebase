import { useState, useContext } from "react";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Link, useNavigate } from "react-router-dom";
import { HotelContext } from "../../context/hotelContext";

import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useContext(HotelContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setUserId(user.uid);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginh2}>Sign in to your account</h2>
      <div className="inputs">
        <label htmlFor="email">Email </label>
        <input
          type="email"
          placeholder="george@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="inputs">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className={styles.loginBtn} onClick={handleLogin}>
        Login
      </button>
      <p className="case">
        Don't have a profile?
        <Link className={styles.registerLink} to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
