const STORAGE_KEY = "savebite_health_medicines";

function readStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(err);
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

    name: medicine.name,

    quantity: medicine.quantity,

    expiry: medicine.expiry,

    reminder: medicine.reminder,

    remaining:
      Number(
        medicine.quantity.replace(/\D/g, "")
      ) || 0,

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

  const updated = medicines.map((m) =>
    m.id === id
      ? {
          ...m,
          ...updatedMedicine,
          updatedAt: new Date().toISOString(),
        }
      : m
  );

  writeStorage(updated);
}

export async function deleteMedicine(id) {
  const medicines = readStorage();

  writeStorage(
    medicines.filter((m) => m.id !== id)
  );
}

export async function markDoseTaken(id) {
  const medicines = readStorage();

  const updated = medicines.map((m) => {
    if (m.id !== id) return m;

    return {
      ...m,
      remaining:
        m.remaining > 0
          ? m.remaining - 1
          : 0,

      takenCount: m.takenCount + 1,

      lastTaken: new Date().toISOString(),
    };
  });

  writeStorage(updated);
}

export async function markDoseMissed(id) {
  const medicines = readStorage();

  const updated = medicines.map((m) =>
    m.id === id
      ? {
          ...m,
          missedCount: m.missedCount + 1,
        }
      : m
  );

  writeStorage(updated);
}