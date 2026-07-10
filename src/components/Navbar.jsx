import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        {/* Replace logo.png with your app logo later */}
        <img
  src="/savebite-logo.png"
  alt="SaveBite AI"
  className="logo-img"
/>
        <h2>SaveBite AI</h2>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}

export default Navbar;