import { Routes, Route } from "react-router-dom";
import Assistant from "./pages/Assistant";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Pantry from "./pages/Pantry";
import Scan from "./pages/Scan";
import Recipes from "./pages/recipes";
import Donation from "./pages/Donation";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pantry"
        element={
          <ProtectedRoute>
            <Pantry />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <Scan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recipes"
        element={
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donation"
        element={
          <ProtectedRoute>
            <Donation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
  path="/assistant"
  element={
    <ProtectedRoute>
      <Assistant />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;