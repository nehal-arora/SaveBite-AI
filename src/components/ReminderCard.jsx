import { useMemo } from "react";

function ReminderCard({
  medicine,
  onEdit,
  onDelete,
  onTaken,
}) {
  const refillDays = useMemo(() => {
    const qty = Number(medicine.quantity || 0);
    const remaining = Number(medicine.remaining || 0);

    if (!qty || !remaining) return 0;

    switch (medicine.frequency) {
      case "Daily":
        return remaining;

      case "Weekly":
        return remaining * 7;

      case "Every 2 Weeks":
        return remaining * 14;

      case "Monthly":
        return remaining * 30;

      case "Custom":
        return remaining * Number(medicine.customDays || 1);

      default:
        return remaining;
    }
  }, [medicine]);

  const refillStatus =
    medicine.remaining <= 5
      ? "critical"
      : medicine.remaining <= 10
      ? "warning"
      : "safe";

  return (
    <div className="medicine-card">

      <div className="medicine-top">

        <div>
          <h3>{medicine.name}</h3>

          <p>{medicine.dosage}</p>
        </div>

        <span className={`status ${refillStatus}`}>
          {medicine.remaining} Left
        </span>

      </div>

      <div className="medicine-details">

        <div>
          <strong>Frequency</strong>
          <span>{medicine.frequency}</span>
        </div>

        <div>
          <strong>Reminder</strong>
          <span>{medicine.time}</span>
        </div>

        <div>
          <strong>Started</strong>
          <span>{medicine.startDate}</span>
        </div>

        <div>
          <strong>Refill In</strong>
          <span>{refillDays} Days</span>
        </div>

      </div>

      {medicine.notes && (
        <div className="medicine-notes">
          {medicine.notes}
        </div>
      )}

      <div className="medicine-actions">

        <button
          className="taken-btn"
          onClick={() => onTaken(medicine.id)}
        >
          ✓ Dose Taken
        </button>

        <button
          className="edit-btn"
          onClick={() => onEdit(medicine)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(medicine.id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default ReminderCard;