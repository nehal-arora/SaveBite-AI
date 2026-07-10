import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="home">

        <section className="hero">

          <img
            src="/savebite-logo.png"
            alt="SaveBite AI"
            className="hero-logo"
          />

          <h1>SaveBite AI</h1>

          <p>
            AI-powered food expiry tracking that helps families organize their pantry,
            reduce food waste, receive smart reminders, generate recipes and donate
            surplus food before it expires.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </div>

        </section>

        <section className="features">

          <div className="feature-card">
            <h2>🤖 AI Expiry Detection</h2>
            <p>
              Scan receipts or product labels and let AI automatically detect expiry dates.
            </p>
          </div>

          <div className="feature-card">
            <h2>🥫 Smart Pantry</h2>
            <p>
              Organize your pantry, receive reminders, and never forget expiring food.
            </p>
          </div>

          <div className="feature-card">
            <h2>❤️ Food Donation</h2>
            <p>
              Donate surplus food to NGOs before it goes to waste.
            </p>
          </div>

        </section>

        <section className="stats">

          <div>
            <h2>95%</h2>
            <p>AI Accuracy</p>
          </div>

          <div>
            <h2>24/7</h2>
            <p>Smart Monitoring</p>
          </div>

          <div>
            <h2>100%</h2>
            <p>Food Waste Awareness</p>
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Home;