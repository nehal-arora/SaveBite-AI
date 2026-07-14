import { useEffect, useMemo, useState } from "react";
import "../styles/health.css";

import {
  Plus,
  Pill,
  CalendarClock,
  Trash2,
  HeartPulse,
  Bell,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getMedicines,
  addMedicine,
  deleteMedicine,
  markDoseTaken,
  markDoseMissed,
} from "../services/medicineService";

function HealthHub() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [medicine, setMedicine] = useState({
    name: "",
    quantity: "",
    expiry: "",
    reminder: "",
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  async function loadMedicines() {
    setLoading(true);

    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  async function handleAddMedicine(e) {
    e.preventDefault();

    if (!medicine.name.trim()) return;

    await addMedicine(medicine);

    setMedicine({
      name: "",
      quantity: "",
      expiry: "",
      reminder: "",
    });

    setShowForm(false);

    loadMedicines();
  }

  async function handleDelete(id) {
    await deleteMedicine(id);
    loadMedicines();
  }

  async function handleTaken(id) {
    await markDoseTaken(id);
    loadMedicines();
  }

  async function handleMissed(id) {
    await markDoseMissed(id);
    loadMedicines();
  }

  function getExpiryStatus(expiry) {
    if (!expiry)
      return {
        text: "No Expiry",
        className: "safe",
      };

    const today = new Date();

    const expiryDate = new Date(expiry);

    const diff = Math.ceil(
      (expiryDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (diff < 0)
      return {
        text: "Expired",
        className: "expired",
      };

    if (diff <= 7)
      return {
        text: "Expiring Soon",
        className: "warning",
      };

    return {
      text: "Safe",
      className: "safe",
    };
  }

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) =>
      medicine.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [medicines, search]);

  const totalMedicines = medicines.length;

  const expiryTracking = medicines.filter(
    (m) => m.expiry
  ).length;

  const reminders = medicines.filter(
    (m) => m.reminder
  ).length;

  return (
    <div className="health-page">

      <div className="health-header">

        <div>

          <h1>Health Hub</h1>

          <p>
            Manage medicines,
            reminders and expiry dates.
          </p>

        </div>

        <button
          className="add-medicine-btn"
          onClick={() => setShowForm(true)}
        >

          <Plus size={20} />

          Add Medicine

        </button>

      </div>

      <div className="health-stats">

        <div className="health-stat-card">

          <div className="icon-box">

            <Pill />

          </div>

          <div>

            <h3>{totalMedicines}</h3>

            <p>Total Medicines</p>

          </div>

        </div>

        <div className="health-stat-card">

          <div className="icon-box warning">

            <CalendarClock />

          </div>

          <div>

            <h3>{expiryTracking}</h3>

            <p>Expiry Tracking</p>

          </div>

        </div>

        <div className="health-stat-card">

          <div className="icon-box success">

            <Bell />

          </div>

          <div>

            <h3>{reminders}</h3>

            <p>Active Reminders</p>

          </div>

        </div>

      </div>

      <div className="medicine-search">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>
            <div className="medicine-section">

        <div className="section-title">

          <div>

            <h2>Your Medicine Cabinet</h2>

            <p>
              Keep track of medicines and
              never miss an expiry.
            </p>

          </div>

          <HeartPulse size={28} />

        </div>

        {loading ? (

          <div className="empty-health-card">

            <h3>Loading medicines...</h3>

          </div>

        ) : filteredMedicines.length === 0 ? (

          <div className="empty-health-card">

            <Pill size={45} />

            <h3>No medicines found</h3>

            <p>
              Add your first medicine to start
              tracking your health.
            </p>

            <button
              className="empty-add-btn"
              onClick={() => setShowForm(true)}
            >

              <Plus size={18} />

              Add Medicine

            </button>

          </div>

        ) : (

          <div className="medicine-grid">

            {filteredMedicines.map((item) => {

              const status = getExpiryStatus(item.expiry);

              return (

                <div
                  className="medicine-card"
                  key={item.id}
                >

                  <div className="medicine-card-top">

                    <div className="medicine-icon">

                      <Pill size={24} />

                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                  <h3>{item.name}</h3>

                  <span
                    className={`expiry-badge ${status.className}`}
                  >
                    {status.text}
                  </span>

                  <div className="medicine-info">

                    <span>Quantity</span>

                    <strong>{item.quantity}</strong>

                  </div>

                  <div className="medicine-info">

                    <span>Remaining</span>

                    <strong>{item.remaining}</strong>

                  </div>

                  <div className="medicine-info">

                    <span>Expiry</span>

                    <strong>{item.expiry}</strong>

                  </div>

                  <div className="medicine-info">

                    <span>Reminder</span>

                    <strong>

                      {item.reminder || "Not Set"}

                    </strong>

                  </div>

                  <div className="medicine-info">

                    <span>Doses Taken</span>

                    <strong>

                      {item.takenCount}

                    </strong>

                  </div>

                  <div className="medicine-info">

                    <span>Missed Doses</span>

                    <strong>

                      {item.missedCount}

                    </strong>

                  </div>

                  <div className="dose-buttons">

                    <button
                      className="taken-btn"
                      onClick={() => handleTaken(item.id)}
                    >

                      <CheckCircle size={18} />

                      Taken

                    </button>

                    <button
                      className="missed-btn"
                      onClick={() => handleMissed(item.id)}
                    >

                      <XCircle size={18} />

                      Missed

                    </button>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>
            {showForm && (
        <div className="medicine-overlay">

          <form
            className="medicine-modal"
            onSubmit={handleAddMedicine}
          >

            <h2>Add Medicine</h2>

            <p>
              Store medicine details and receive reminders.
            </p>

            <input
              type="text"
              placeholder="Medicine Name"
              value={medicine.name}
              onChange={(e) =>
                setMedicine({
                  ...medicine,
                  name: e.target.value,
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Quantity (Example: 10 tablets)"
              value={medicine.quantity}
              onChange={(e) =>
                setMedicine({
                  ...medicine,
                  quantity: e.target.value,
                })
              }
              required
            />

            <input
              type="date"
              value={medicine.expiry}
              onChange={(e) =>
                setMedicine({
                  ...medicine,
                  expiry: e.target.value,
                })
              }
            />

            <input
              type="time"
              value={medicine.reminder}
              onChange={(e) =>
                setMedicine({
                  ...medicine,
                  reminder: e.target.value,
                })
              }
            />

            <div className="modal-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                Save Medicine
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default HealthHub;