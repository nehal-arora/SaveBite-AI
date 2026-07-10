import { useEffect, useState } from "react";

function AddMedicineModal({ medicine, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "Daily",
    time: "09:00",
    startDate: new Date().toISOString().split("T")[0],
    quantity: 30,
    remaining: 30,
    reminderEnabled: true,
    notes: "",
    customDays: 1,
  });

  useEffect(() => {
    if (medicine) {
      setForm({
        ...medicine,
        customDays: medicine.customDays || 1,
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...form,
      quantity: Number(form.quantity),
      remaining: Number(form.remaining),
      customDays: Number(form.customDays),
      createdAt: medicine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="medicine-modal">

        <div className="modal-header">
          <h2>
            {medicine ? "Edit Medicine" : "Add Medicine"}
          </h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Medicine Name</label>

            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Dosage</label>

            <input
              type="text"
              name="dosage"
              placeholder="1 Tablet / 5 ml"
              required
              value={form.dosage}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Frequency</label>

              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Every 2 Weeks</option>
                <option>Monthly</option>
                <option>Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reminder Time</label>

              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>

          </div>

          {form.frequency === "Custom" && (
            <div className="form-group">
              <label>Repeat Every (Days)</label>

              <input
                type="number"
                min="1"
                name="customDays"
                value={form.customDays}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Start Date</label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Total Quantity</label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Remaining</label>

              <input
                type="number"
                name="remaining"
                value={form.remaining}
                onChange={handleChange}
              />
            </div>

          </div>
                    <div className="form-group">
            <label>Notes</label>

            <textarea
              name="notes"
              rows="3"
              placeholder="Take after food, before sleep, etc."
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="reminderEnabled"
              name="reminderEnabled"
              checked={form.reminderEnabled}
              onChange={handleChange}
            />

            <label htmlFor="reminderEnabled">
              Enable Browser Reminder
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              {medicine ? "Update Medicine" : "Save Medicine"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddMedicineModal;