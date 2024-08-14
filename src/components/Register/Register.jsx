import { useState } from "react";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !rePassword) {
      alert("All fields are required.");
      return;
    }

    if (password !== rePassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password, rePassword);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="login-container">
      <h2>Register</h2>
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
      <div className="inputs">
        <input
          type="Password"
          placeholder="Repassword.."
          onChange={(e) => setRePassword(e.target.value)}
        />
      </div>
      <button className="login-btn" onClick={handleRegister}>
        Register
      </button>
      <p className="case">
        Already have a profile?
        <Link className="register-link" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
