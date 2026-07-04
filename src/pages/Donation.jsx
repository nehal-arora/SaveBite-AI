import { useEffect, useState } from "react";
import "../styles/donation.css";
import { auth } from "../services/firebase";
import { getPantryItems } from "../services/pantryService";

function Donation() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    if (!auth.currentUser) return;

    const data = await getPantryItems(auth.currentUser.uid);

    const today = new Date();

    const expiring = data.filter((item) => {
      const expiry = new Date(item.expiry);

      const diff =
        (expiry - today) /
        (1000 * 60 * 60 * 24);

      return diff >= 0 && diff <= 3;
    });

    setItems(expiring);
  }

  function donate(food) {
    alert(`${food} donation request submitted! ❤️`);
  }

  return (
    <div className="donation-page">

      <h1>❤️ Food Donation</h1>

      <p>
        These items are close to expiry and can be donated.
      </p>

      {items.length === 0 ? (
        <h3>No items available for donation.</h3>
      ) : (
        items.map((item) => (
          <div
            className="donation-card"
            key={item.id}
          >
            <div>
              <h2>{item.food}</h2>

              <p>📅 {item.expiry}</p>

              <p>📦 {item.quantity}</p>
            </div>

            <button
              onClick={() =>
                donate(item.food)
              }
            >
              Donate
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default Donation;