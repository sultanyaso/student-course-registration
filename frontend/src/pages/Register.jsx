import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/books.webp";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      // Save token and role in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Redirect based on role
      if (res.data.user.role === "student") {
        navigate("/student");
      } else if (res.data.user.role === "teacher") {
        navigate("/teacher");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed.");
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
        onSubmit={handleRegister}
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
        <h2 style={{ textAlign: "center", marginBottom: "25px" ,color: "black"}}>Create Account</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

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

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

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
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "18px", fontSize: "14px", color: "black" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
          >
            Login
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

export default Register;
