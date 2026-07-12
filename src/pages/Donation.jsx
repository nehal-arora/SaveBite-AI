import { useEffect, useState } from "react";
import "../styles/donation.css";

import { auth } from "../services/firebase";
import { getPantryItems } from "../services/pantryService";
import { saveDonation } from "../services/donationService";

function Donation() {

  const [items, setItems] = useState([]);

  useEffect(() => {

    loadItems();

  }, []);

  async function loadItems() {

    if (!auth.currentUser) return;

    const data = await getPantryItems(auth.currentUser.uid);

    const today = new Date();

    const expiring = data.filter((item) => {

      const expiry = new Date(item.expiry);

      const diff =

        (expiry - today) /

        (1000 * 60 * 60 * 24);

      return diff >= 0 && diff <= 3;

    });

    setItems(expiring);

  }
    async function donate(item) {

    if (!auth.currentUser) return;

    const success = await saveDonation({

      userId: auth.currentUser.uid,

      food: item.food,

      quantity: item.quantity,

      expiry: item.expiry,

      recommendedOrganization: getAISuggestion().title,

      status: "Pending"

    });

    if (success) {

      setItems((prevItems) =>
        prevItems.filter(
          (foodItem) => foodItem.id !== item.id
        )
      );

      alert("❤️ Donation request saved successfully!");

    } else {

      alert("❌ Something went wrong.");

    }

  }

  function openSearch(query) {

    const url =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    window.open(url, "_blank");

  }
    function getAISuggestion() {

    if (items.length === 0) {

      return {

        title: "No Donation Required",

        description:
          "You currently don't have any food items that require immediate donation.",

        query: "Food donation NGO near me",

        button: "Find Nearby NGOs"

      };

    }

    const names = items
      .map((item) => item.food.toLowerCase())
      .join(" ");

    if (

      names.includes("milk") ||
      names.includes("bread") ||
      names.includes("butter") ||
      names.includes("curd") ||
      names.includes("paneer")

    ) {

      return {

        title: "👵 Old Age Homes & 👶 Orphanages",

        description:
          "Fresh dairy and bakery products should be donated quickly. Old age homes and orphanages are the most suitable donation destinations.",

        query: "Old age home near me accepting food",

        button: "Find Old Age Homes"

      };

    }

    if (

      names.includes("rice") ||
      names.includes("atta") ||
      names.includes("flour") ||
      names.includes("dal") ||
      names.includes("wheat")

    ) {

      return {

        title: "🍲 Community Kitchens",

        description:
          "Dry groceries are ideal for community kitchens because they can prepare fresh meals for many people.",

        query: "Community kitchen near me",

        button: "Find Community Kitchens"

      };

    }

    if (

      names.includes("fruit") ||
      names.includes("apple") ||
      names.includes("banana") ||
      names.includes("orange") ||
      names.includes("vegetable")

    ) {

      return {

        title: "🏢 NGOs",

        description:
          "Fresh fruits and vegetables can be distributed quickly through nearby NGOs and food charities.",

        query: "Food donation NGO near me",

        button: "Find Nearby NGOs"

      };

    }

    if (names.includes("baby")) {

      return {

        title: "👶 Orphanages",

        description:
          "Baby food and nutrition products are best donated to orphanages and child care centres.",

        query: "Orphanage near me",

        button: "Find Orphanages"

      };

    }

    if (

      names.includes("dog") ||
      names.includes("cat") ||
      names.includes("pet")

    ) {

      return {

        title: "🐶 Animal Shelters",

        description:
          "Pet food should be donated to nearby animal shelters.",

        query: "Animal shelter near me",

        button: "Find Animal Shelters"

      };

    }

    return {

      title: "🏢 NGOs",

      description:
        "These food items can be donated to nearby NGOs, shelters and community organisations before they expire.",

      query: "Food donation NGO near me",

      button: "Find Nearby NGOs"

    };

  }

  function getUrgency() {

    if (items.length === 0) {

      return {

        level: "🟢 No Urgent Donations",

        color: "#22C55E",

        text: "Your pantry looks great! No food requires immediate donation."

      };

    }

    const today = new Date();

    let minDays = 999;

    items.forEach((item) => {

      const expiry = new Date(item.expiry);

      const diff = Math.ceil(

        (expiry - today) /

        (1000 * 60 * 60 * 24)

      );

      if (diff < minDays) {

        minDays = diff;

      }

    });

    if (minDays <= 1) {

      return {

        level: "🔴 High Priority",

        color: "#EF4444",

        text: "Some food expires within 24 hours. Donate it today."

      };

    }

    if (minDays <= 2) {

      return {

        level: "🟡 Medium Priority",

        color: "#F59E0B",

        text: "Some food expires within the next 2 days."

      };

    }

    return {

      level: "🟢 Low Priority",

      color: "#22C55E",

      text: "Your food still has a little time remaining."

    };

  }

  const aiSuggestion = getAISuggestion();

  const urgency = getUrgency();
    return (

    <div className="donation-page">

      <h1>

        <span className="title-icon">❤️</span>

        Food Donation Hub

      </h1>

      <p>

        Donate surplus food before it expires and help people in need.
        SaveBite AI intelligently recommends the best organizations
        based on your pantry items.

      </p>

      {items.length === 0 ? (

        <div className="empty-state">

          <h3>

            ❤️ Nothing to Donate

          </h3>

          <p>

            Great job! You don't have any food items
            that are close to expiry.

          </p>

        </div>

      ) : (

        items.map((item) => (

          <div

            key={item.id}

            className="donation-card"

          >

            <div>

              <h2>

                {item.food}

              </h2>

              <p>

                📅 Expiry : {item.expiry}

              </p>

              <p>

                📦 Quantity : {item.quantity}

              </p>

            </div>

            <button

              onClick={() => donate(item)}

            >

              ❤️ Donate Now

            </button>

          </div>

        ))

      )}

      <div className="find-org-section">

        <div className="ai-recommendation">

          <div className="ai-header">

            <span>🤖 AI Recommendation</span>

          </div>

          <h3>

            {aiSuggestion.title}

          </h3>

          <p>

            {aiSuggestion.description}

          </p>

          <div

            className="urgency-box"

            style={{

              borderLeft: `5px solid ${urgency.color}`

            }}

          >

            <h4>

              {urgency.level}

            </h4>

            <p>

              {urgency.text}

            </p>

          </div>

          <button

            className="ai-search-btn"

            onClick={() => openSearch(aiSuggestion.query)}

          >

            🔍 {aiSuggestion.button}

          </button>

        </div>

        <h2>

          🌍 Find Nearby Donation Organizations

        </h2>

        <p>

          Choose an organization below to quickly search nearby locations
          using Google Maps.

        </p>

        <div className="search-grid">
                  <div className="search-card">

            <div className="search-icon">

              🏢

            </div>

            <h3>

              NGOs

            </h3>

            <p>

              Donate packaged food, groceries and daily essentials
              to NGOs serving communities in need.

            </p>

            <button
              className="search-btn"
              onClick={() =>
                openSearch("Food donation NGO near me")
              }
            >

              🔍 Find Nearby NGOs

            </button>

          </div>

          <div className="search-card">

            <div className="search-icon">

              👵

            </div>

            <h3>

              Old Age Homes

            </h3>

            <p>

              Fresh meals, fruits and dairy products can help
              elderly residents in care homes.

            </p>

            <button
              className="search-btn"
              onClick={() =>
                openSearch("Old age home near me")
              }
            >

              🔍 Find Old Age Homes

            </button>

          </div>

          <div className="search-card">

            <div className="search-icon">

              👶

            </div>

            <h3>

              Orphanages

            </h3>

            <p>

              Donate nutritious food that can benefit children
              and young residents.

            </p>

            <button
              className="search-btn"
              onClick={() =>
                openSearch("Orphanage near me")
              }
            >

              🔍 Find Orphanages

            </button>

          </div>

          <div className="search-card">

            <div className="search-icon">

              🍲

            </div>

            <h3>

              Community Kitchens

            </h3>

            <p>

              Community kitchens prepare fresh meals every day
              and can make excellent use of surplus groceries.

            </p>

            <button
              className="search-btn"
              onClick={() =>
                openSearch("Community kitchen near me")
              }
            >

              🔍 Find Community Kitchens

            </button>

          </div>

          <div className="search-card">

            <div className="search-icon">

              🛕

            </div>

            <h3>

              Gurudwaras / Langars

            </h3>

            <p>

              Many Gurudwaras serve free Langar meals daily and
              often accept food donations.

            </p>

            <button
              className="search-btn"
              onClick={() =>
                openSearch("Gurudwara langar near me")
              }
            >

              🔍 Find Gurudwaras

            </button>

          </div>

          <div className="search-card">

            <div className="search-icon">

              🏠

            </div>

            <h3>

              Shelters

            </h3>

            <p>

              Search nearby shelters and community support centres
              that may accept surplus food.

            </p>

            <button
              className="search-btn"
              onClick={() =>
                openSearch("Homeless shelter near me")
              }
            >

              🔍 Find Shelters

            </button>

          </div>

        </div>
                <div className="donation-tip">

          <h3>

            💡 Before You Donate

          </h3>

          <ul>

            <li>

              ✔ Donate food before its expiry date.

            </li>

            <li>

              ✔ Ensure the packaging is sealed, clean and undamaged.

            </li>

            <li>

              ✔ Contact the organization beforehand to confirm that they are currently accepting food donations.

            </li>

            <li>

              ✔ Transport food hygienically to maintain its quality and safety.

            </li>

          </ul>

        </div>

      </div>

    </div>

  );

}

export default Donation;