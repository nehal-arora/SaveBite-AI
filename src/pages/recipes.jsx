import { useEffect, useState } from "react";
import "../styles/recipes.css";

import { auth } from "../services/firebase";
import { getPantryItems } from "../services/pantryService";
import { model } from "../services/gemini";

function Recipes() {
  const [recipes, setRecipes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecipes();
  }, []);

  async function generateRecipes() {
    if (!auth.currentUser) return;

    setLoading(true);

    try {
      const items = await getPantryItems(auth.currentUser.uid);

      if (items.length === 0) {
        setRecipes("🥫 Your pantry is empty. Add some items first.");
        setLoading(false);
        return;
      }

      const ingredients = items
        .map((item) => item.food)
        .join(", ");

      const prompt = `
You are SaveBite AI, a professional chef and nutrition expert.

The user has these pantry ingredients:

${ingredients}

Generate exactly 5 recipes.

For EACH recipe include:

🍽 Recipe Name

⭐ Difficulty (Easy/Medium/Hard)

⏱ Preparation Time

🔥 Calories (Approx.)

🥗 Ingredients Used (only from pantry + common spices)

👨‍🍳 Step-by-step Cooking Instructions

💚 Health Benefits

💡 Tip to Reduce Food Waste

Format the response neatly using headings and emojis.

Do not use markdown tables.

Keep every recipe practical and easy for students and families.
`;

      const response = await model.generateContent(prompt);

      setRecipes(response.response.text());

    } catch (error) {
      console.error(error);
      setRecipes("❌ Failed to generate recipes.");
    }

    setLoading(false);
  }

  return (
    <div className="recipes-page">

      <div className="recipes-box">

        <h1>🍳 AI Recipe Generator</h1>

        <p>
          Recipes generated from your pantry items.
        </p>

        <button
  className="generate-btn"
  onClick={generateRecipes}
  disabled={loading}
>
  {loading ? "🤖 Creating AI Recipes..." : "✨ Generate AI Recipes"}
</button>

        <div className="recipe-result">

          {loading ? (
  <>
    <div className="loading-spinner"></div>
    <p
      style={{
        textAlign: "center",
        color: "#CBD5E1",
        marginTop: "20px",
      }}
    >
      SaveBite AI is preparing personalized recipes...
    </p>
  </>
) : (
  <pre
    style={{
      whiteSpace: "pre-wrap",
      fontFamily: "inherit",
    }}
  >
    {recipes}
  </pre>
)}

        </div>

      </div>

    </div>
  );
}

export default Recipes;