import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      console.log(error.code);
      console.log(error.message);

      alert(error.code);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <img
          src="/savebite-logo.png"
          alt="SaveBite AI"
          className="auth-logo"
        />

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue managing your smart pantry.
        </p>

        <input
          className="auth-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;