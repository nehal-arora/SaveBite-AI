import { useState } from "react";
import "../styles/assistant.css";
import { auth } from "../services/firebase";
import { getPantryItems } from "../services/pantryService";
import { model } from "../services/gemini";

function Assistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question.trim()) {
      alert("Enter a question.");
      return;
    }

    setLoading(true);

    try {
      const items = await getPantryItems(auth.currentUser.uid);

      const pantry = items.length
        ? items.map((item) => item.food).join(", ")
        : "No pantry items";

      const prompt = `
You are SaveBite AI.

User Pantry:
${pantry}

User Question:
${question}

Answer in a friendly way.

If recipes are requested, use pantry items.

If food storage is requested, explain briefly.

If healthy alternatives are requested, suggest them.

Keep the answer under 250 words.
`;

      const response = await model.generateContent(prompt);

      setAnswer(response.response.text());

    } catch (err) {
      console.error(err);
      setAnswer("❌ Failed to generate response.");
    }

    setLoading(false);
  }

  return (
    <div className="assistant-page">

      <div className="assistant-box">

        <h1>🤖 SaveBite AI Assistant</h1>

        <p>
          Ask anything about recipes, food storage, nutrition or your pantry.
        </p>

        <textarea
          placeholder="Example: What can I cook with my pantry items?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={askAI}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        <div className="answer-box">
          <pre>{answer}</pre>
        </div>

      </div>

    </div>
  );
}

export default Assistant;