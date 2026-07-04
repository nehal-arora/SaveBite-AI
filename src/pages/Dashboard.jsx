import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import { auth } from "../services/firebase";
import { getPantryItems } from "../services/pantryService";

function Dashboard() {
  const navigate = useNavigate();

  const [totalItems, setTotalItems] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    if (!auth.currentUser) return;

    const items = await getPantryItems(auth.currentUser.uid);

    setTotalItems(items.length);

    let expiring = 0;

    const today = new Date();

    items.forEach((item) => {
      if (!item.expiry || item.expiry === "Not Found") return;

      const expiryDate = new Date(item.expiry);

      const diff =
        (expiryDate - today) / (1000 * 60 * 60 * 24);

      if (diff >= 0 && diff <= 3) {
        expiring++;
      }
    });

    setExpiringSoon(expiring);

    // Demo estimate
    setMoneySaved(items.length * 120);
  }

  return (
    <div className="dashboard">

      <h1>Welcome back 👋</h1>

      <p className="subtitle">
        Here's your smart pantry overview.
      </p>

      <div className="stats">

        <div className="stat-card">
          <h2>{totalItems}</h2>
          <p>Products Tracked</p>
        </div>

        <div className="stat-card">
          <h2>{expiringSoon}</h2>
          <p>Expiring Soon</p>
        </div>

        <div className="stat-card">
          <h2>{Math.max(totalItems - expiringSoon, 0)}</h2>
          <p>Fresh Items</p>
        </div>

        <div className="stat-card">
          <h2>₹{moneySaved}</h2>
          <p>Estimated Savings</p>
        </div>

      </div>

      <div className="grid">

        <div className="panel">

          <h3>📊 Pantry Status</h3>

          <div className="item">
            🥫 Total Items : {totalItems}
          </div>

          <div className="item">
            ⏰ Expiring Soon : {expiringSoon}
          </div>

          <div className="item">
            ✅ Fresh Items : {Math.max(totalItems - expiringSoon, 0)}
          </div>

        </div>

        <div className="panel">

  <h3>⚡ Quick Actions</h3>
  <button
  className="quick-btn"
  onClick={() => navigate("/assistant")}
>
  🤖 AI Assistant
</button>

  <button
    className="quick-btn"
    onClick={() => navigate("/scan")}
  >
    📷 Scan Product
  </button>

  <button
    className="quick-btn"
    onClick={() => navigate("/pantry")}
  >
    🥫 Pantry
  </button>

  <button
    className="quick-btn"
    onClick={() => navigate("/recipes")}
  >
    🍳 AI Recipes
  </button>

  <button
    className="quick-btn"
    onClick={() => navigate("/donation")}
  >
    ❤️ Donate Food
  </button>

  <button
    className="quick-btn"
    onClick={() => navigate("/analytics")}
  >
    📊 Analytics
  </button>

  <button
    className="quick-btn"
    onClick={() => navigate("/profile")}
  >
    👤 Profile
  </button>

</div>

      </div>

    </div>
  );
}

export default Dashboard;