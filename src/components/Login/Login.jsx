import { useState } from "react";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign in to your account</h2>
      <div className="inputs">
        <input
          type="email"
          placeholder="Email.."
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="inputs">
        <input
          type="password"
          placeholder="Password.."
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>
      <p className="case">
        Don't have a profile?
        <Link className="register-link" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
