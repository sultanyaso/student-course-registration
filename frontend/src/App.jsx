// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// We create a wrapper component to access useLocation()
function AppContent() {
  const location = useLocation();

  // Define paths where the Top Navbar should NOT appear
  const hideNavbarPaths = ["/student", "/admin", "/teacher"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
        <Route
          path="/teacher"
          element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>}
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