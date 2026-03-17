// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminInfo, setAdminInfo] = useState(null);

  const [newCourse, setNewCourse] = useState({ name: "", instructor: "", creditHours: "", feePerCredit: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const token = localStorage.getItem("token");

  // --- Fetch Admin Info ---
  const fetchAdminInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminInfo(res.data.admin);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin info.");
    }
  };

  // --- Fetch Students ---
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch students.");
    }
  };

  // --- Fetch Courses ---
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses.");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAdminInfo(), fetchStudents(), fetchCourses()]).finally(() => setLoading(false));
  }, []);

  // --- Approve / Reject Student ---
  const handleApproval = async (id, approve = true) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/students/${id}`,
        { approve },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStudents();
    } catch (err) {
      console.error(err);
      setError("Failed to update student status.");
    }
  };

  // --- Add Course ---
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCourse.name || !newCourse.instructor || newCourse.creditHours === "" || newCourse.feePerCredit === "") {
      return setError("All fields are required");
    }

    try {
      setLoadingCourses(true);
      await axios.post(
        "http://localhost:5000/api/admin/courses",
        {
          name: newCourse.name,
          instructor: newCourse.instructor,
          creditHours: Number(newCourse.creditHours),
          feePerCredit: Number(newCourse.feePerCredit),
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setNewCourse({ name: "", instructor: "", creditHours: "", feePerCredit: "" });
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to add course.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // --- Update Course ---
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setError("");

    if (!editingCourse.name || !editingCourse.instructor || editingCourse.creditHours === "" || editingCourse.feePerCredit === "") {
      return setError("All fields are required");
    }

    try {
      setLoadingCourses(true);
      await axios.put(
        `http://localhost:5000/api/admin/courses/${editingCourse._id}`,
        {
          name: editingCourse.name,
          instructor: editingCourse.instructor,
          creditHours: Number(editingCourse.creditHours),
          feePerCredit: Number(editingCourse.feePerCredit),
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to update course.");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      setLoadingCourses(true);
      await axios.delete(`http://localhost:5000/api/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to delete course.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // --- Views ---
  const HomeView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Admin Profile</h2>
      {adminInfo && (
        <div style={{ lineHeight: "1.8", fontSize: "15px", color: "#1e293b" }}>
          <p><strong>Name:</strong> {adminInfo.name}</p>
          <p><strong>Email:</strong> {adminInfo.email}</p>
          <p><strong>Role:</strong> {adminInfo.role}</p>
          <p><strong>Total Students:</strong> {students.length}</p>
          <p><strong>Total Courses:</strong> {courses.length}</p>
        </div>
      )}
    </div>
  );

  const StudentsView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Students List</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={tableHeaderStyle}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 && <tr><td colSpan="5" style={tdStyle}>No students found</td></tr>}
          {students.map((student) => (
            <tr key={student._id} style={trStyle}>
              <td style={tdStyle}>{student._id}</td>
              <td style={tdStyle}>{student.name}</td>
              <td style={tdStyle}>{student.email}</td>
              <td style={tdStyle}>{student.isApproved ? <span style={{ color: "green" }}>Approved ✅</span> : <span style={{ color: "orange" }}>Pending ⏳</span>}</td>
              <td style={tdStyle}>
                {!student.isApproved && (
                  <>
                    <button onClick={() => handleApproval(student._id, true)} style={approveButtonStyle}>Approve</button>
                    <button onClick={() => handleApproval(student._id, false)} style={rejectButtonStyle}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CoursesView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Courses List</h2>

      {/* Add/Edit Form */}
      <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Course Name"
          value={editingCourse ? editingCourse.name : newCourse.name}
          onChange={(e) =>
            editingCourse
              ? setEditingCourse({ ...editingCourse, name: e.target.value })
              : setNewCourse({ ...newCourse, name: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Instructor"
          value={editingCourse ? editingCourse.instructor : newCourse.instructor}
          onChange={(e) =>
            editingCourse
              ? setEditingCourse({ ...editingCourse, instructor: e.target.value })
              : setNewCourse({ ...newCourse, instructor: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Credit Hours"
          value={editingCourse ? editingCourse.creditHours : newCourse.creditHours}
          onChange={(e) =>
            editingCourse
              ? setEditingCourse({ ...editingCourse, creditHours: e.target.value })
              : setNewCourse({ ...newCourse, creditHours: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Fee per Credit"
          value={editingCourse ? editingCourse.feePerCredit : newCourse.feePerCredit}
          onChange={(e) =>
            editingCourse
              ? setEditingCourse({ ...editingCourse, feePerCredit: e.target.value })
              : setNewCourse({ ...newCourse, feePerCredit: e.target.value })
          }
          style={inputStyle}
        />
        <button type="submit" disabled={loadingCourses} style={submitButtonStyle}>
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
        {editingCourse && (
          <button type="button" onClick={() => setEditingCourse(null)} style={cancelButtonStyle}>
            Cancel
          </button>
        )}
      </form>

      {/* Courses Table */}
      {courses.length === 0 ? <p>No courses found.</p> :
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderStyle}>
                <th>ID</th>
                <th>Name</th>
                <th>Instructor</th>
                <th>Credit Hours</th>
                <th>Fee per Credit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id} style={trStyle}>
                  <td style={tdStyle}>{course._id}</td>
                  <td style={tdStyle}>{course.name}</td>
                  <td style={tdStyle}>{course.instructor}</td>
                  <td style={tdStyle}>{course.creditHours}</td>
                  <td style={tdStyle}>{course.feePerCredit}</td>
                  <td style={tdStyle}>
                    <button onClick={() => setEditingCourse(course)} style={approveButtonStyle}>✏️ Edit</button>
                    <button onClick={() => handleDeleteCourse(course._id)} style={rejectButtonStyle}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );

  const ReportsView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Reports</h2>
      <p style={{ color: "#64748b", marginTop: "10px" }}>Reports and analytics will be added here soon.</p>
    </div>
  );

  if (loading) return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", backgroundColor: "#f1f5f9" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px", fontSize: "22px" }}>Admin Portal</h2>
          <button onClick={() => setActiveTab("home")} style={menuItemStyle(activeTab === "home")}>🏠 Home</button>
          <button onClick={() => setActiveTab("students")} style={menuItemStyle(activeTab === "students")}>👩‍🎓 Students</button>
          <button onClick={() => setActiveTab("courses")} style={menuItemStyle(activeTab === "courses")}>📚 Courses</button>
          <button onClick={() => setActiveTab("reports")} style={menuItemStyle(activeTab === "reports")}>📊 Reports</button>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={logoutButtonStyle}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {error && <div style={errorBoxStyle}>⚠️ {error}</div>}
          {activeTab === "home" && <HomeView />}
          {activeTab === "students" && <StudentsView />}
          {activeTab === "courses" && <CoursesView />}
          {activeTab === "reports" && <ReportsView />}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const sidebarStyle = { width: "280px", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "30px 20px", height: "100vh", position: "sticky", top: 0, boxSizing: "border-box" };
const menuItemStyle = (isActive) => ({ width: "100%", padding: "14px 18px", marginBottom: "12px", textAlign: "left", backgroundColor: isActive ? "#2563eb" : "transparent", color: isActive ? "white" : "#94a3b8", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: isActive ? "600" : "400", transition: "all 0.2s ease", display: "block" });
const logoutButtonStyle = { padding: "14px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", marginTop: "20px" };
const cardStyle = { backgroundColor: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)" };
const sectionHeaderStyle = { color: "#1e293b", marginBottom: "20px", fontSize: "20px" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tableHeaderStyle = { background: "#2563eb", color: "#fff", textAlign: "center" };
const trStyle = { textAlign: "center", borderBottom: "1px solid #e5e7eb" };
const tdStyle = { padding: "10px" };
const approveButtonStyle = { marginRight: "5px", padding: "6px 12px", background: "#10b981", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
const rejectButtonStyle = { padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
const inputStyle = { padding: "8px", borderRadius: "5px", border: "1px solid #ccc", flex: "1 1 150px" };
const submitButtonStyle = { padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px" };
const cancelButtonStyle = { padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: "5px" };
const errorBoxStyle = { padding: "15px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "20px", border: "1px solid #fecaca" };

export default AdminDashboard;