// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <Link to="/" style={{ color: "#fff", marginRight: "10px" }}>Login</Link>
      <Link to="/register" style={{ color: "#fff" }}>Register</Link>
    </nav>
  );
};

export default Navbar;
