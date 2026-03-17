// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [courses, setCourses] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingCourse, setProcessingCourse] = useState("");
  const [error, setError] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);

  const token = localStorage.getItem("token");

  // --- Fetch Courses & Registered Courses ---
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const [coursesRes, registeredRes] = await Promise.all([
        axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/student/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCourses(coursesRes.data.courses || []);
      setRegistered((registeredRes.data.registeredCourses || []).map(c => c._id));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses. Backend might be down.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Student Info ---
  const fetchStudentInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentInfo(res.data.student);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch student info.");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudentInfo();
  }, []);

  // --- Register / Unregister Course ---
  const handleCourseToggle = async (courseId, isRegistered) => {
    try {
      setProcessingCourse(courseId);
      if (isRegistered) {
        await axios.post(
          `http://localhost:5000/api/student/unregister/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/student/register/${courseId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to update course registration.");
    } finally {
      setProcessingCourse("");
    }
  };

  // --- Views ---
  const HomeView = () => {
    if (!studentInfo) return <p>Loading student info...</p>;
    return (
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Student Profile</h2>
        <div style={{ lineHeight: "1.8", fontSize: "15px", color: "#1e293b" }}>
          <p><strong>Name:</strong> {studentInfo.name}</p>
          <p><strong>Roll No:</strong> {studentInfo.rollNo}</p>
          <p><strong>Campus:</strong> {studentInfo.campus}</p>
          <p><strong>Status:</strong> {studentInfo.status}</p>
          <p><strong>Email:</strong> {studentInfo.email}</p>
          <p><strong>Program:</strong> {studentInfo.program}</p>
          <p><strong>Registered Courses:</strong> {registered.length}</p>
        </div>
      </div>
    );
  };

  // --- Course Registration Tab ---
const CourseRegistrationView = () => {
  const registeredCourses = courses.filter(c => registered.includes(c._id));

  return (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Available Courses</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={thStyle}>Course Name</th>
              <th style={thStyle}>Instructor</th>
              <th style={thStyle}>Credit Hours</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr>
                <td colSpan="4" style={tdStyle}>No courses available</td>
              </tr>
            )}
            {courses.map(course => {
              const isRegistered = registered.includes(course._id);
              return (
                <tr key={course._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{course.name}</td>
                  <td style={tdStyle}>{course.instructor}</td>
                  <td style={tdStyle}>{course.creditHours}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleCourseToggle(course._id, isRegistered)}
                      disabled={processingCourse === course._id}
                      style={isRegistered ? unregButtonStyle : regButtonStyle}
                    >
                      {processingCourse === course._id ? "..." : isRegistered ? "Unregister" : "Register"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Registered Courses List */}
      <h2 style={{ ...sectionHeaderStyle, marginTop: "30px" }}>My Registered Courses</h2>
      {registeredCourses.length === 0 ? (
        <p style={{ color: "#64748b" }}>No courses registered yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#0f172a", color: "#fff" }}>
              <th style={thStyle}>Course Name</th>
              <th style={thStyle}>Instructor</th>
              <th style={thStyle}>Credit Hours</th>
            </tr>
          </thead>
          <tbody>
            {registeredCourses.map(c => (
              <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.instructor}</td>
                <td style={tdStyle}>{c.creditHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

  // --- Fee Slip Tab ---
  const FeeSlipView = () => {
    const registeredCourses = courses.filter(c => registered.includes(c._id));
    const totalFee = registeredCourses.reduce(
      (sum, c) => sum + c.creditHours * c.feePerCredit,
      0
    );

    return (
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Fee Slip</h2>
        {registeredCourses.length === 0 ? (
          <p style={{ color: "#64748b" }}>No registered courses to generate fee slip.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#2563eb", color: "#fff" }}>
                <th style={thStyle}>Course Name</th>
                <th style={thStyle}>Credit Hours</th>
                <th style={thStyle}>Fee per Credit</th>
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {registeredCourses.map(c => (
                <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{c.name}</td>
                  <td style={tdStyle}>{c.creditHours}</td>
                  <td style={tdStyle}>{c.feePerCredit}</td>
                  <td style={tdStyle}>{c.creditHours * c.feePerCredit}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ padding: "15px", fontWeight: "bold", textAlign: "right" }}>Total Fee:</td>
                <td style={{ padding: "15px", fontWeight: "bold" }}>{totalFee}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const PlaceholderView = (title) => (
    <div style={cardStyle}>
      <h2 style={{ color: "#1e293b" }}>{title}</h2>
      <p style={{ color: "#64748b", marginTop: "10px" }}>
        Data for <strong>{title}</strong> will be added soon.
      </p>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", backgroundColor: "#f1f5f9" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px", fontSize: "22px" }}>Portal</h2>
          <button onClick={() => setActiveTab("home")} style={menuItemStyle(activeTab === "home")}>🏠 Home</button>
          <button onClick={() => setActiveTab("registration")} style={menuItemStyle(activeTab === "registration")}>📚 Course Registration</button>
          <button onClick={() => setActiveTab("attendance")} style={menuItemStyle(activeTab === "attendance")}>📅 Attendance</button>
          <button onClick={() => setActiveTab("marks")} style={menuItemStyle(activeTab === "marks")}>📊 Marks</button>
          <button onClick={() => setActiveTab("transcript")} style={menuItemStyle(activeTab === "transcript")}>📜 Transcript</button>
          <button onClick={() => setActiveTab("fee")} style={menuItemStyle(activeTab === "fee")}>💳 Fee Slip</button>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={logoutButtonStyle}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ color: "#0f172a", marginBottom: "10px" }}>Student Dashboard</h1>
          <p style={{ color: "#64748b", marginBottom: "30px" }}>Welcome back! Manage your academic profile here.</p>

          {error && <div style={errorBoxStyle}>⚠️ {error}</div>}

          {loading ? <p>Loading Dashboard Content...</p> : (
            <>
              {activeTab === "home" && <HomeView />}
              {activeTab === "registration" && <CourseRegistrationView />}
              {activeTab === "attendance" && PlaceholderView("Attendance Records")}
              {activeTab === "marks" && PlaceholderView("Examination Marks")}
              {activeTab === "transcript" && PlaceholderView("Academic Transcript")}
              {activeTab === "fee" && <FeeSlipView />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const sidebarStyle = { width: "280px", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "30px 20px", height: "100vh", position: "sticky", top: 0, boxSizing: "border-box" };
const menuItemStyle = (isActive) => ({ width: "100%", padding: "14px 18px", marginBottom: "12px", textAlign: "left", backgroundColor: isActive ? "#2563eb" : "transparent", color: isActive ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: isActive ? "600" : "400", transition: "all 0.2s ease" });
const logoutButtonStyle = { padding: "14px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", marginTop: "20px" };
const cardStyle = { backgroundColor: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "15px", textAlign: "left", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" };
const tdStyle = { padding: "15px", color: "#334155" };
const regButtonStyle = { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" };
const unregButtonStyle = { padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" };
const sectionHeaderStyle = { color: "#1e293b", marginBottom: "20px", fontSize: "20px" };
const errorBoxStyle = { padding: "15px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "20px", border: "1px solid #fecaca" };

export default StudentDashboard;