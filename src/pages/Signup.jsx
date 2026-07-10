import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/auth.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      alert(error.message);
      console.log(error);
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

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join SaveBite AI and start reducing food waste with smart AI.
        </p>

        <input
          className="auth-input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="auth-btn"
          onClick={handleSignup}
        >
          Create Account
        </button>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;