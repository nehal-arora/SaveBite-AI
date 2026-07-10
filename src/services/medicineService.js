const STORAGE_KEY = "savebite_health_medicines";

function readStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading medicines:", error);
    return [];
  }
}

function writeStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getMedicines() {
  return readStorage();
}

export async function addMedicine(medicine) {
  const medicines = readStorage();

  const newMedicine = {
    id: crypto.randomUUID(),
    ...medicine,
    lastTaken: null,
    takenCount: 0,
    missedCount: 0,
    createdAt: new Date().toISOString(),
  };

  medicines.push(newMedicine);

  writeStorage(medicines);

  return newMedicine;
}

export async function updateMedicine(id, updatedMedicine) {
  const medicines = readStorage();

  const updated = medicines.map((medicine) =>
    medicine.id === id
      ? {
          ...medicine,
          ...updatedMedicine,
          updatedAt: new Date().toISOString(),
        }
      : medicine
  );

  writeStorage(updated);
}

export async function deleteMedicine(id) {
  const medicines = readStorage();

  const filtered = medicines.filter(
    (medicine) => medicine.id !== id
  );

  writeStorage(filtered);
}

export async function markDoseTaken(id) {
  const medicines = readStorage();

  const updated = medicines.map((medicine) => {
    if (medicine.id !== id) return medicine;

    const remaining =
      Number(medicine.remaining) > 0
        ? Number(medicine.remaining) - 1
        : 0;

    return {
      ...medicine,
      remaining,
      takenCount: (medicine.takenCount || 0) + 1,
      lastTaken: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  writeStorage(updated);
}

export async function markDoseMissed(id) {
  const medicines = readStorage();

  const updated = medicines.map((medicine) =>
    medicine.id === id
      ? {
          ...medicine,
          missedCount: (medicine.missedCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        }
      : medicine
  );

  writeStorage(updated);
}

export async function getUpcomingRefills(days = 7) {
  const medicines = readStorage();

  return medicines.filter((medicine) => {
    const remaining = Number(medicine.remaining || 0);

    switch (medicine.frequency) {
      case "Daily":
        return remaining <= days;

      case "Weekly":
        return remaining * 7 <= days;

      case "Every 2 Weeks":
        return remaining * 14 <= days;

      case "Monthly":
        return remaining * 30 <= days;

      case "Custom":
        return (
          remaining * Number(medicine.customDays || 1) <= days
        );

      default:
        return false;
    }
  });
}

export async function clearAllMedicines() {
  localStorage.removeItem(STORAGE_KEY);
}