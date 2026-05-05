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
const [searchTerm, setSearchTerm] = useState("");
const [departmentFilter, setDepartmentFilter] = useState("");

// --- Fetch Courses & Registered Courses ---
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
    setError("Failed to fetch courses. Backend might be down.");
  } finally {
    setLoading(false);
  }
};

const [availableQuizzes, setAvailableQuizzes] = useState([]);
const [activeQuiz, setActiveQuiz] = useState(null);

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

const [assignments, setAssignments] = useState([]);

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
  fetchCourses();
  fetchStudentInfo();
  fetchQuizzes();
  fetchAssignments();
}, [searchTerm, departmentFilter]);

// --- AI Chatbot Widget ---
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! How can I help you today?", isAI: true }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages([...messages, { text: userMsg, isAI: false }]);
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMsg,
        context: `Student dashboard, registered for ${registered.length} courses.`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [...prev, { text: res.data.reply, isAI: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting.", isAI: true }]);
    } finally {
      setTyping(false);
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      style={{ position: "fixed", bottom: "30px", right: "30px", width: "60px", height: "60px", borderRadius: "50%", background: "#2563eb", color: "white", border: "none", cursor: "pointer", fontSize: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 1000 }}
    >
      💬
    </button>
  );

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", width: "350px", height: "500px", background: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1000 }}>
      <div style={{ padding: "15px", background: "#2563eb", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>AI Assistant</strong>
        <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>✖</button>
      </div>
      <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.isAI ? "flex-start" : "flex-end", maxWidth: "80%", padding: "10px", borderRadius: "12px", background: m.isAI ? "#f1f5f9" : "#2563eb", color: m.isAI ? "black" : "white", fontSize: "14px" }}>
            {m.text}
          </div>
        ))}
        {typing && <div style={{ fontSize: "12px", color: "#64748b" }}>AI is typing...</div>}
      </div>
      <div style={{ padding: "10px", borderTop: "1px solid #eee", display: "flex", gap: "5px" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything..." 
          style={{ ...inputStyle, flex: 1, padding: "8px" }}
        />
        <button onClick={handleSend} style={{ ...regButtonStyle, padding: "8px 12px" }}>Send</button>
      </div>
    </div>
  );
};

// --- Assignments View ---
const AssignmentsView = () => {
  const [uploading, setUploading] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (assignmentId) => {
    if (!file) return alert("Please select a file first");
    setUploading(assignmentId);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);

    try {
      await axios.post("http://localhost:5000/api/assignments/submit", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      alert("Assignment submitted successfully!");
      fetchAssignments();
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading("");
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Assignments</h2>
      {assignments.length === 0 ? <p>No assignments found for your courses.</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {assignments.map(asgn => (
            <div key={asgn._id} style={{ ...cardStyle, border: "1px solid #e2e8f0", padding: "20px" }}>
              <h4 style={{ margin: "0 0 5px 0" }}>{asgn.title}</h4>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>{asgn.courseId?.name}</p>
              <p style={{ fontSize: "14px" }}>{asgn.description}</p>
              <p style={{ fontSize: "13px" }}><strong>Deadline:</strong> {new Date(asgn.deadline).toLocaleDateString()}</p>
              <p style={{ fontSize: "13px" }}><strong>Status:</strong> 
                <span style={{ 
                  marginLeft: "5px", 
                  padding: "2px 8px", 
                  borderRadius: "4px", 
                  background: asgn.status === "pending" ? "#fef3c7" : "#dcfce7",
                  color: asgn.status === "pending" ? "#92400e" : "#166534"
                }}>
                  {asgn.status.toUpperCase()}
                </span>
              </p>
              {asgn.status === "pending" ? (
                <div style={{ marginTop: "15px" }}>
                  <input type="file" onChange={handleFileChange} style={{ fontSize: "12px", marginBottom: "10px", width: "100%" }} />
                  <button 
                    onClick={() => handleUpload(asgn._id)} 
                    disabled={uploading === asgn._id}
                    style={{ ...regButtonStyle, width: "100%" }}
                  >
                    {uploading === asgn._id ? "Uploading..." : "Submit Assignment"}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #eee" }}>
                  <p style={{ fontSize: "12px", color: "#166534" }}>✅ Submitted: {asgn.submission?.fileName}</p>
                  {asgn.status === "graded" && (
                    <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", marginTop: "5px" }}>
                      <p style={{ margin: 0 }}><strong>Grade:</strong> {asgn.submission?.grade}/{asgn.maxScore}</p>
                      <p style={{ margin: "5px 0 0 0", fontStyle: "italic" }}>"{asgn.submission?.feedback}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  // --- Quiz Taking Interface ---
  const QuizTakingInterface = ({ quiz, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (timeLeft <= 0) {
        handleSubmit();
        return;
      }
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }, [timeLeft]);

    const handleSubmit = async () => {
      setSubmitting(true);
      try {
        const answersArray = Object.keys(selectedAnswers).map(qId => ({
          questionId: qId,
          selectedAnswer: selectedAnswers[qId]
        }));
        await axios.post("http://localhost:5000/api/quizzes/submit", {
          quizId: quiz._id,
          answers: answersArray
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onComplete();
      } catch (err) {
        console.error(err);
        alert("Failed to submit quiz.");
      } finally {
        setSubmitting(false);
      }
    };

    const currentQuestion = quiz.questions[currentIndex];

    return (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
        <div style={{ ...cardStyle, width: "600px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>{quiz.title}</h3>
            <div style={{ fontWeight: "bold", color: timeLeft < 60 ? "red" : "black" }}>
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p><strong>Question {currentIndex + 1} of {quiz.questions.length}:</strong></p>
            <p style={{ fontSize: "18px" }}>{currentQuestion.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestion._id]: option })}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    background: selectedAnswers[currentQuestion._id] === option ? "#2563eb" : "#f1f5f9",
                    color: selectedAnswers[currentQuestion._id] === option ? "white" : "black",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px"
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              style={regButtonStyle}
            >
              Previous
            </button>
            {currentIndex === quiz.questions.length - 1 ? (
              <button onClick={handleSubmit} disabled={submitting} style={{ ...regButtonStyle, background: "green" }}>
                {submitting ? "Submitting..." : "Finish Quiz"}
              </button>
            ) : (
              <button onClick={() => setCurrentIndex(currentIndex + 1)} style={regButtonStyle}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
  // --- Schedule View ---
  const ScheduleView = () => {
    const registeredCourses = courses.filter(c => registered.includes(c._id));
    return (
      <div style={cardStyle}>
        <h2 style={sectionHeaderStyle}>My Weekly Schedule</h2>
        {registeredCourses.length === 0 ? <p>No courses registered yet.</p> : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#0f172a", color: "#fff" }}>
                <th style={thStyle}>Course</th>
                <th style={thStyle}>Schedule</th>
                <th style={thStyle}>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {registeredCourses.map(c => (
                <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{c.name}</td>
                  <td style={tdStyle}>{c.schedule || "TBD"}</td>
                  <td style={tdStyle}>{c.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  // --- Quiz Hub View ---
  const QuizHubView = () => (
    <div style={cardStyle}>
    <h2 style={sectionHeaderStyle}>Available Quizzes</h2>
    {availableQuizzes.length === 0 ? <p>No quizzes available for your registered courses.</p> : (
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
          {availableQuizzes.map(quiz => (
            <tr key={quiz._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{quiz.title}</td>
              <td style={tdStyle}>{quiz.courseId?.name}</td>
              <td style={tdStyle}>{quiz.duration} mins</td>
              <td style={tdStyle}>
                {quiz.isAttempted ? (
                  <span style={{ color: "green" }}>Attempted (Score: {quiz.score})</span>
                ) : (
                  <span style={{ color: "orange" }}>Pending</span>
                )}
              </td>
              <td style={tdStyle}>
                {!quiz.isAttempted && (
                  <button 
                    onClick={() => setActiveQuiz(quiz)}
                    style={regButtonStyle}
                  >
                    Take Quiz
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
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

  // --- Home View ---
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

    if (!studentInfo) return <p>Loading student info...</p>;

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

  // --- Course Registration Tab ---
const CourseRegistrationView = () => {
  const registeredCourses = courses.filter(c => registered.includes(c._id));

  return (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Available Courses</h2>
      
      {/* Search and Filter UI */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          type="text" 
          placeholder="Search by course, instructor..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, flex: 2, marginBottom: 0 }}
        />
        <select 
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="English">English</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={thStyle}>Course Name</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Instructor</th>
              <th style={thStyle}>Credit Hours</th>
              <th style={thStyle}>Seats</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 && (
              <tr>
                <td colSpan="6" style={tdStyle}>No courses available</td>
              </tr>
            )}
            {courses.map(course => {
              const isRegistered = registered.includes(course._id);
              return (
                <tr key={course._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{course.name}</td>
                  <td style={tdStyle}>{course.department || "N/A"}</td>
                  <td style={tdStyle}>{course.instructor}</td>
                  <td style={tdStyle}>{course.creditHours}</td>
                  <td style={tdStyle}>{course.capacity - (course.enrolledCount || 0)}</td>
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

  const handleQuizComplete = () => {
    setActiveQuiz(null);
    fetchQuizzes();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", backgroundColor: "#f1f5f9" }}>
      {/* Quiz Overlay */}
      {activeQuiz && (
        <QuizTakingInterface 
          quiz={activeQuiz} 
          onComplete={handleQuizComplete} 
        />
      )}

      <ChatWidget />
      
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px", fontSize: "22px" }}>Portal</h2>
          <button onClick={() => setActiveTab("home")} style={menuItemStyle(activeTab === "home")}>🏠 Home</button>
          <button onClick={() => setActiveTab("registration")} style={menuItemStyle(activeTab === "registration")}>📚 Course Registration</button>
          <button onClick={() => setActiveTab("quizzes")} style={menuItemStyle(activeTab === "quizzes")}>📝 Quiz Hub</button>
          <button onClick={() => setActiveTab("assignments")} style={menuItemStyle(activeTab === "assignments")}>📂 Assignments</button>
          <button onClick={() => setActiveTab("schedule")} style={menuItemStyle(activeTab === "schedule")}>📅 My Schedule</button>
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
              {activeTab === "quizzes" && <QuizHubView />}
              {activeTab === "assignments" && <AssignmentsView />}
              {activeTab === "schedule" && <ScheduleView />}
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
const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" };

export default StudentDashboard;