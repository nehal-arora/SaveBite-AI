const BACKEND_URL = "http://127.0.0.1:8000";


export async function saveUserMemory(userId, text) {
  try {
    await fetch(
      `${BACKEND_URL}/memory/add?user_id=${userId}&text=${encodeURIComponent(text)}`,
      {
        method: "POST",
      }
    );
  } catch (error) {
    console.error("Memory save failed:", error);
  }
}


export async function getUserMemory(userId, query) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/memory/search?user_id=${userId}&query=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    return JSON.stringify(data);

  } catch (error) {
    console.error("Memory fetch failed:", error);
    return "";
  }
}