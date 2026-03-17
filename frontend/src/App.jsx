// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// We create a wrapper component to access useLocation()
function AppContent() {
  const location = useLocation();

  // Define paths where the Top Navbar should NOT appear
  const hideNavbarPaths = ["/student", "/admin"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* Only show Navbar if we are NOT on a dashboard path */}
      {!shouldHideNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student"
          element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;