import { useEffect, useState } from "react";
import "../styles/profile.css";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { getPantryItems } from "../services/pantryService";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    if (!auth.currentUser) return;

    const data = await getPantryItems(auth.currentUser.uid);

    setTotalItems(data.length);
  }

  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="avatar">
          👤
        </div>

        <h1>My Profile</h1>

        <h3>{auth.currentUser?.email}</h3>

        <div className="profile-info">

          <div className="info-card">
            <h2>{totalItems}</h2>
            <p>Pantry Items</p>
          </div>

          <div className="info-card">
            <h2>SaveBite AI</h2>
            <p>Version 2.0</p>
          </div>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;