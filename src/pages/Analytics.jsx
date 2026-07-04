import { useEffect, useState } from "react";
import "../styles/analytics.css";
import { auth } from "../services/firebase";
import { getPantryItems } from "../services/pantryService";

function Analytics() {
  const [totalItems, setTotalItems] = useState(0);
  const [freshItems, setFreshItems] = useState(0);
  const [expiringItems, setExpiringItems] = useState(0);
  const [expiredItems, setExpiredItems] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    if (!auth.currentUser) return;

    const items = await getPantryItems(auth.currentUser.uid);

    setTotalItems(items.length);

    let fresh = 0;
    let expiring = 0;
    let expired = 0;

    const today = new Date();

    items.forEach((item) => {
      const expiry = new Date(item.expiry);

      const diff =
        (expiry - today) /
        (1000 * 60 * 60 * 24);

      if (diff < 0)
        expired++;
      else if (diff <= 3)
        expiring++;
      else
        fresh++;
    });

    setFreshItems(fresh);
    setExpiringItems(expiring);
    setExpiredItems(expired);
  }

  return (
    <div className="analytics-page">

      <h1 className="analytics-title">
        📊 Pantry Analytics
      </h1>

      <div className="analytics-grid">

        <div className="analytics-card">
          <h2>{totalItems}</h2>
          <p>Total Items</p>
        </div>

        <div className="analytics-card">
          <h2>{freshItems}</h2>
          <p>Fresh Items</p>
        </div>

        <div className="analytics-card">
          <h2>{expiringItems}</h2>
          <p>Expiring Soon</p>
        </div>

        <div className="analytics-card">
          <h2>{expiredItems}</h2>
          <p>Expired</p>
        </div>

        <div className="analytics-card">
          <h2>₹{totalItems * 120}</h2>
          <p>Estimated Savings</p>
        </div>

        <div className="analytics-card">
          <h2>{totalItems * 2} kg</h2>
          <p>Food Waste Prevented</p>
        </div>

      </div>

    </div>
  );
}

export default Analytics;