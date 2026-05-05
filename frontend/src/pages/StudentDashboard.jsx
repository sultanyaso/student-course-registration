// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState("home");
  const [courses, setCourses] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingCourse, setProcessingCourse] = useState("");
  const [error, setError] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const token = localStorage.getItem("token");

  // --- Data Fetching ---
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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (departmentFilter) params.department = departmentFilter;

      const [coursesRes, registeredRes] = await Promise.all([
        axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
          params
        }),
        axios.get("http://localhost:5000/api/student/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCourses(coursesRes.data.courses || []);
      setRegistered((registeredRes.data.registeredCourses || []).map(c => c._id));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quizzes/available", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableQuizzes(res.data.quizzes);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data.assignments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
    fetchAssignments();
  }, [searchTerm, departmentFilter]);

  // --- Handlers ---
  const handleCourseToggle = async (courseId, isRegistered) => {
    try {
      setProcessingCourse(courseId);
      if (isRegistered) {
        await axios.post(`http://localhost:5000/api/student/unregister/${courseId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/student/register/${courseId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setProcessingCourse("");
    }
  };

  const handleQuizComplete = () => {
    setActiveQuiz(null);
    fetchQuizzes();
  };

  // --- Sub-Components ---

  const HomeView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(studentInfo || {});

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.put("http://localhost:5000/api/student/profile", editForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentInfo(res.data.student);
        setIsEditing(false);
        alert("Profile updated!");
      } catch (err) {
        console.error(err);
        alert("Failed to update profile.");
      }
    };

    if (!studentInfo) return <p>Loading...</p>;

    if (isEditing) return (
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Edit Profile</h2>
        <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
          <input type="text" placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Roll No" value={editForm.rollNo} onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Campus" value={editForm.campus} onChange={(e) => setEditForm({ ...editForm, campus: e.target.value })} style={inputStyle} />
          <input type="text" placeholder="Program" value={editForm.program} onChange={(e) => setEditForm({ ...editForm, program: e.target.value })} style={inputStyle} />
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={regButtonStyle}>Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ ...regButtonStyle, background: "#64748b" }}>Cancel</button>
          </div>
        </form>
      </div>
    );

    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={sectionHeaderStyle}>Student Profile</h2>
          <button onClick={() => { setEditForm(studentInfo); setIsEditing(true); }} style={regButtonStyle}>✏️ Edit Profile</button>
        </div>
        <div style={{ lineHeight: "1.8", fontSize: "15px", color: "#1e293b" }}>
          <p><strong>Name:</strong> {studentInfo.name}</p>
          <p><strong>Roll No:</strong> {studentInfo.rollNo || "N/A"}</p>
          <p><strong>Campus:</strong> {studentInfo.campus || "N/A"}</p>
          <p><strong>Status:</strong> {studentInfo.status}</p>
          <p><strong>Email:</strong> {studentInfo.email}</p>
          <p><strong>Program:</strong> {studentInfo.program || "N/A"}</p>
          <p><strong>Registered Courses:</strong> {registered.length}</p>
        </div>
      </div>
    );
  };

  const CourseRegistrationView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Available Courses</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
        </select>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#2563eb", color: "#fff" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Instructor</th>
            <th style={thStyle}>Credits</th>
            <th style={thStyle}>Seats</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{c.name}</td>
              <td style={tdStyle}>{c.instructor}</td>
              <td style={tdStyle}>{c.creditHours}</td>
              <td style={tdStyle}>{c.capacity - c.enrolledCount}</td>
              <td style={tdStyle}>
                <button onClick={() => handleCourseToggle(c._id, registered.includes(c._id))} disabled={processingCourse === c._id} style={registered.includes(c._id) ? unregButtonStyle : regButtonStyle}>
                  {processingCourse === c._id ? "..." : registered.includes(c._id) ? "Unregister" : "Register"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const QuizHubView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Available Quizzes</h2>
      {availableQuizzes.length === 0 ? <p>No quizzes found.</p> : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Duration</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {availableQuizzes.map(q => (
              <tr key={q._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{q.title}</td>
                <td style={tdStyle}>{q.courseId?.name}</td>
                <td style={tdStyle}>{q.duration}m</td>
                <td style={tdStyle}>{q.isAttempted ? `Score: ${q.score}` : "Pending"}</td>
                <td style={tdStyle}>
                  {!q.isAttempted && <button onClick={() => setActiveQuiz(q)} style={regButtonStyle}>Take Quiz</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const QuizTakingInterface = ({ quiz, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (timeLeft <= 0) { handleSubmit(); return; }
      const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
      return () => clearInterval(timer);
    }, [timeLeft]);

    const handleSubmit = async () => {
      setSubmitting(true);
      try {
        const answersArray = Object.keys(selectedAnswers).map(id => ({ questionId: id, selectedAnswer: selectedAnswers[id] }));
        await axios.post("http://localhost:5000/api/quizzes/submit", { quizId: quiz._id, answers: answersArray }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onComplete();
      } catch (err) { alert("Error submitting quiz."); } finally { setSubmitting(false); }
    };

    const q = quiz.questions[currentIndex];
    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1001 }}>
        <div style={{ ...cardStyle, width: "600px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3>{quiz.title}</h3>
            <span style={{ color: timeLeft < 60 ? "red" : "inherit" }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <p><strong>Question {currentIndex + 1}:</strong> {q.question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0" }}>
            {q.options.map(opt => (
              <button key={opt} onClick={() => setSelectedAnswers({ ...selectedAnswers, [q._id]: opt })} style={{ padding: "10px", textAlign: "left", background: selectedAnswers[q._id] === opt ? "#2563eb" : "#f1f5f9", color: selectedAnswers[q._id] === opt ? "white" : "black", border: "1px solid #ddd", borderRadius: "6px" }}>
                {opt}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} style={regButtonStyle}>Prev</button>
            {currentIndex === quiz.questions.length - 1 ? 
              <button onClick={handleSubmit} disabled={submitting} style={{ ...regButtonStyle, background: "green" }}>Finish</button> :
              <button onClick={() => setCurrentIndex(currentIndex + 1)} style={regButtonStyle}>Next</button>
            }
          </div>
        </div>
      </div>
    );
  };

  const AssignmentsView = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState("");

    const handleUpload = async (asgnId) => {
      if (!file) return alert("Select file");
      setUploading(asgnId);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("assignmentId", asgnId);
      try {
        await axios.post("http://localhost:5000/api/assignments/submit", fd, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        alert("Submitted!");
        fetchAssignments();
      } catch (err) { alert("Upload failed."); } finally { setUploading(""); }
    };

    return (
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Assignments</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {assignments.map(a => (
            <div key={a._id} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "10px" }}>
              <h4>{a.title}</h4>
              <p style={{ fontSize: "13px" }}>{a.courseId?.name}</p>
              <p style={{ fontSize: "12px", color: "#666" }}>Deadline: {new Date(a.deadline).toLocaleDateString()}</p>
              <p>Status: <strong style={{ color: a.status === "pending" ? "orange" : "green" }}>{a.status.toUpperCase()}</strong></p>
              {a.status === "pending" && (
                <div style={{ marginTop: "10px" }}>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ fontSize: "11px", marginBottom: "5px" }} />
                  <button onClick={() => handleUpload(a._id)} disabled={uploading === a._id} style={{ ...regButtonStyle, width: "100%" }}>Submit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ScheduleView = () => {
    const registeredCourses = courses.filter(c => registered.includes(c._id));
    return (
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>My Schedule</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#0f172a", color: "#fff" }}>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {registeredCourses.map(c => (
              <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.schedule || "TBD"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const FeeSlipView = () => {
    const regCourses = courses.filter(c => registered.includes(c._id));
    const total = regCourses.reduce((s, c) => s + (c.creditHours * c.feePerCredit), 0);
    return (
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>Fee Slip</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Fee</th>
            </tr>
          </thead>
          <tbody>
            {regCourses.map(c => (
              <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.creditHours * c.feePerCredit}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold" }}><td style={tdStyle}>Total</td><td style={tdStyle}>{total}</td></tr>
          </tbody>
        </table>
      </div>
    );
  };

  const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [msgs, setMsgs] = useState([{ text: "How can I help?", ai: true }]);
    const [inp, setInp] = useState("");
    const [typing, setTyping] = useState(false);

    const send = async () => {
      if (!inp.trim()) return;
      const m = inp; setInp("");
      setMsgs([...msgs, { text: m, ai: false }]);
      setTyping(true);
      try {
        const res = await axios.post("http://localhost:5000/api/chat", { message: m, context: "Dashboard" }, { headers: { Authorization: `Bearer ${token}` } });
        setMsgs(prev => [...prev, { text: res.data.reply, ai: true }]);
      } catch (err) { setMsgs(prev => [...prev, { text: "Error connecting.", ai: true }]); } finally { setTyping(false); }
    };

    if (!isOpen) return <button onClick={() => setIsOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", width: "50px", height: "50px", borderRadius: "50%", background: "#2563eb", color: "white", border: "none", cursor: "pointer", zIndex: 1000 }}>💬</button>;

    return (
      <div style={{ position: "fixed", bottom: "20px", right: "20px", width: "300px", height: "400px", background: "white", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", zIndex: 1000 }}>
        <div style={{ padding: "10px", background: "#2563eb", color: "white", borderRadius: "12px 12px 0 0", display: "flex", justifyContent: "space-between" }}>
          <strong>AI Support</strong>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>✖</button>
        </div>
        <div style={{ flex: 1, padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ alignSelf: m.ai ? "flex-start" : "flex-end", background: m.ai ? "#eee" : "#2563eb", color: m.ai ? "black" : "white", padding: "8px", borderRadius: "8px", fontSize: "13px", maxWidth: "85%" }}>{m.text}</div>
          ))}
          {typing && <span style={{ fontSize: "11px" }}>AI typing...</span>}
        </div>
        <div style={{ padding: "10px", borderTop: "1px solid #eee", display: "flex" }}>
          <input type="text" value={inp} onChange={(e) => setInp(e.target.value)} onKeyPress={(e) => e.key === "Enter" && send()} placeholder="Type..." style={{ flex: 1, padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }} />
          <button onClick={send} style={{ marginLeft: "5px" }}>Send</button>
        </div>
      </div>
    );
  };

  const PlaceholderView = (title) => (
    <div style={cardStyle}>
      <h2>{title}</h2>
      <p>Content for {title} coming soon.</p>
    </div>
  );

  // --- Main Render ---
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", backgroundColor: "#f1f5f9" }}>
      {activeQuiz && <QuizTakingInterface quiz={activeQuiz} onComplete={handleQuizComplete} />}
      <ChatWidget />
      
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>Portal</h2>
          <button onClick={() => setActiveTab("home")} style={menuItemStyle(activeTab === "home")}>🏠 Home</button>
          <button onClick={() => setActiveTab("registration")} style={menuItemStyle(activeTab === "registration")}>📚 Registration</button>
          <button onClick={() => setActiveTab("quizzes")} style={menuItemStyle(activeTab === "quizzes")}>📝 Quizzes</button>
          <button onClick={() => setActiveTab("assignments")} style={menuItemStyle(activeTab === "assignments")}>📂 Assignments</button>
          <button onClick={() => setActiveTab("schedule")} style={menuItemStyle(activeTab === "schedule")}>📅 Schedule</button>
          <button onClick={() => setActiveTab("fee")} style={menuItemStyle(activeTab === "fee")}>💳 Fee Slip</button>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={logoutButtonStyle}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {error && <div style={errorBoxStyle}>{error}</div>}
          {loading && activeTab !== "home" ? <p>Loading...</p> : (
            <>
              {activeTab === "home" && <HomeView />}
              {activeTab === "registration" && <CourseRegistrationView />}
              {activeTab === "quizzes" && <QuizHubView />}
              {activeTab === "assignments" && <AssignmentsView />}
              {activeTab === "schedule" && <ScheduleView />}
              {activeTab === "fee" && <FeeSlipView />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const sidebarStyle = { width: "260px", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "30px 20px", height: "100vh", position: "sticky", top: 0 };
const menuItemStyle = (isActive) => ({ width: "100%", padding: "12px 15px", marginBottom: "10px", textAlign: "left", backgroundColor: isActive ? "#2563eb" : "transparent", color: isActive ? "white" : "#94a3b8", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: isActive ? "600" : "400", display: "block" });
const logoutButtonStyle = { padding: "12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const cardStyle = { backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
const sectionHeaderStyle = { color: "#1e293b", marginBottom: "20px", fontSize: "18px" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "12px", textAlign: "left", fontSize: "13px" };
const tdStyle = { padding: "12px", color: "#334155", fontSize: "14px" };
const regButtonStyle = { padding: "6px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" };
const unregButtonStyle = { padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" };
const errorBoxStyle = { padding: "12px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "20px" };
const inputStyle = { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" };

export default StudentDashboard;
