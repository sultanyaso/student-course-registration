import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/books.webp";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      // Save token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Redirect based on role
      if (res.data.user.role === "student") {
        navigate("/student");
      } else if (res.data.user.role === "teacher") {
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Login</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "18px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

export default Login;
