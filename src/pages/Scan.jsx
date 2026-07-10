import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/scan.css";
import { model } from "../services/gemini";
import { auth } from "../services/firebase";
import { addPantryItem } from "../services/pantryService";

function Scan() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function handleImage(e) {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setResult("");
    }
  }

  function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve({
          inlineData: {
            data: reader.result.split(",")[1],
            mimeType: file.type,
          },
        });
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function testGemini() {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setResult("🤖 AI is analyzing your product...");

      const imagePart = await fileToGenerativePart(imageFile);

      const response = await model.generateContent([
        `
You are SaveBite AI, an expert food intelligence assistant.

Analyze this food product image carefully.

Return ONLY valid JSON.

{
  "product":"",
  "brand":"",
  "category":"",
  "quantity":"",
  "expiry":"",
  "nutrition":"",
  "healthScore":"",
  "storageTips":"",
  "shelfLife":"",
  "recommendation":""
}

Rules:

1. Product name
2. Brand name
3. Category
4. Quantity
5. Expiry date
6. Nutrition summary
7. Health score out of 10
8. Storage tips
9. Shelf life after opening
10. Recommendation

If something isn't visible write "Not Found".

Return ONLY JSON.
        `,
        imagePart,
      ]);

      let text = response.response.text().trim();

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(text);

      await addPantryItem(
        {
          food: data.product,
          expiry: data.expiry,
          quantity: data.quantity,
        },
        auth.currentUser.uid
      );

      setResult(`
✅ Product Saved Successfully!

🥛 Product:
${data.product}

🏷 Brand:
${data.brand}

🥗 Category:
${data.category}

📦 Quantity:
${data.quantity}

📅 Expiry:
${data.expiry}

❤️ Health Score:
${data.healthScore}

🍽 Nutrition:
${data.nutrition}

🧊 Storage Tips:
${data.storageTips}

⏳ Shelf Life:
${data.shelfLife}

🤖 Recommendation:
${data.recommendation}
      `);

      setTimeout(() => {
        navigate("/pantry");
      }, 2500);

    } catch (error) {
      console.error(error);

      setResult(
        "❌ AI couldn't read this image.\n\nTry uploading a clearer image with the expiry date visible."
      );
    }

    setLoading(false);
  }
    return (
    <div className="scan-page">
      <motion.div
        className="scan-box"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <img
          src="/savebite-logo.png"
          alt="SaveBite AI"
          className="scan-logo"
        />

        <h1>AI Food Scanner</h1>

        <p className="scan-subtitle">
          Upload a food packet or receipt and let SaveBite AI detect expiry,
          nutrition, storage tips and more.
        </p>

        <label className="upload-area">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImage}
          />

          {image ? (
            <img
              src={image}
              alt="Preview"
              className="preview"
            />
          ) : (
            <>
              <h2>📷 Upload Food Image</h2>
              <p>Click here or drag & drop your image</p>
            </>
          )}
        </label>

        <button
          className="scan-btn"
          onClick={testGemini}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Scan with AI"}
        </button>

        {loading && (
          <motion.div
            className="ai-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="loader-circle"></div>

            <h3>🤖 SaveBite AI is analyzing...</h3>

            <p>
              Detecting product details, expiry date,
              nutrition and storage recommendations...
            </p>
          </motion.div>
        )}

        {!loading && (
          <motion.div
            className="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>AI Scan Result</h3>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
              }}
            >
              {result ||
                "Upload an image and click 'Scan with AI' to begin."}
            </pre>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Scan;