import { useEffect, useMemo, useState } from "react";
import "../styles/pantry.css";
import { auth } from "../services/firebase";
import {
  addPantryItem,
  getPantryItems,
  deletePantryItem,
  updatePantryItem,
} from "../services/pantryService";

function Pantry() {
  const [food, setFood] = useState("");
  const [expiry, setExpiry] = useState("");
  const [quantity, setQuantity] = useState("");

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      loadItems();
    }
  }, []);

  async function loadItems() {
    const data = await getPantryItems(auth.currentUser.uid);
    setItems(data);
  }

  async function handleAdd() {
    if (!food || !expiry || !quantity) {
      alert("Please fill all fields.");
      return;
    }

    await addPantryItem(
      {
        food,
        expiry,
        quantity,
      },
      auth.currentUser.uid
    );

    setFood("");
    setExpiry("");
    setQuantity("");

    loadItems();
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Delete this pantry item?"
    );

    if (!confirmDelete) return;

    await deletePantryItem(id);

    loadItems();
  }

  function handleEdit(item) {
    setEditingId(item.id);

    setFood(item.food);
    setExpiry(item.expiry);
    setQuantity(item.quantity);
  }

  async function handleUpdate() {
    if (!editingId) return;

    await updatePantryItem(editingId, {
      food,
      expiry,
      quantity,
    });

    setEditingId(null);

    setFood("");
    setExpiry("");
    setQuantity("");

    loadItems();
  }

  function getStatus(date) {
    const today = new Date();

    const expiryDate = new Date(date);

    const diff =
      (expiryDate - today) /
      (1000 * 60 * 60 * 24);

    if (isNaN(diff))
      return {
        text: "Unknown",
        color: "#64748b",
      };

    if (diff < 0)
      return {
        text: "Expired",
        color: "#ef4444",
      };

    if (diff <= 3)
      return {
        text: "Expiring Soon",
        color: "#f59e0b",
      };

    return {
      text: "Fresh",
      color: "#22c55e",
    };
  }

  const filteredItems = useMemo(() => {
    return [...items]
      .filter((item) =>
        item.food
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(a.expiry) -
          new Date(b.expiry)
      );
  }, [items, search]);
    return (
    <div className="pantry-page">

      <h1 className="pantry-title">
        🥫 Smart Pantry
      </h1>

      <div className="form-box">

        <input
          type="text"
          placeholder="Food Name"
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />

        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />

        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {editingId ? (
          <button onClick={handleUpdate}>
            Update
          </button>
        ) : (
          <button onClick={handleAdd}>
            Add Item
          </button>
        )}

      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "25px auto"
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            fontSize: "16px"
          }}
        />
      </div>

      <div className="cards">

        {filteredItems.length === 0 ? (

          <p
            style={{
              textAlign: "center",
              color: "#d1d5db"
            }}
          >
            No pantry items found.
          </p>

        ) : (

          filteredItems.map((item) => {

            const status = getStatus(item.expiry);

            return (

              <div
                className="card"
                key={item.id}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >

                  <h3>
                    {item.food}
                  </h3>

                  <span
                    style={{
                      background: status.color,
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}
                  >
                    {status.text}
                  </span>

                </div>

                <div className="info">

                  <div>
                    📅 Expiry
                    <br />
                    <strong>{item.expiry}</strong>
                  </div>

                  <div>
                    📦 Quantity
                    <br />
                    <strong>{item.quantity}</strong>
                  </div>

                </div>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    gap: "12px"
                  }}
                >

                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "none",
                      borderRadius: "12px",
                      background: "#3b82f6",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "none",
                      borderRadius: "12px",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>
  );
}

export default Pantry;