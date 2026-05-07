// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TeacherDashboard = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState("home");
  const [myCourses, setMyCourses] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Phase 1: Roster
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Phase 2: Quiz Creator
  const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [quizForm, setQuizForm] = useState({
    title: "", courseId: "", duration: 10, source: "custom", questions: []
  });
  const [opentdbParams, setOpentdbParams] = useState({ amount: 5, category: 18, difficulty: "medium" });
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Phase 3: Assignment Manager
  const [teacherAssignments, setTeacherAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    title: "", courseId: "", description: "", deadline: "", maxScore: 100
  });
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const token = localStorage.getItem("token");

  // --- Data Fetching ---
  const fetchTeacherQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quizzes/teacher", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeacherQuizzes(res.data.quizzes || []);
    } catch (err) { console.error(err); }
  };

  const fetchTeacherAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments/teacher", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeacherAssignments(res.data.assignments || []);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [meRes, myCoursesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/student/me", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/teacher/my-courses", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTeacherInfo(meRes.data.student);
      setMyCourses(myCoursesRes.data.courses || []);
      
      await Promise.all([
        fetchTeacherAssignments(),
        fetchTeacherQuizzes()
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch teacher data.");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment and all submissions?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Assignment deleted!");
      fetchTeacherAssignments();
    } catch (err) { toast.error("Delete failed."); }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz and all attempts?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Quiz deleted!");
      fetchTeacherQuizzes();
    } catch (err) { toast.error("Delete failed."); }
  };

  const handleEditAssignment = (asgn) => {
    setNewAssignmentForm({
      id: asgn._id,
      title: asgn.title,
      courseId: asgn.courseId?._id || asgn.courseId,
      description: asgn.description,
      deadline: asgn.deadline.split('T')[0],
      maxScore: asgn.maxScore
    });
    setIsCreatingAssignment(true);
  };

  const handleEditQuiz = (quiz) => {
    setQuizForm({
      id: quiz._id,
      title: quiz.title,
      courseId: quiz.courseId?._id || quiz.courseId,
      duration: quiz.duration,
      source: quiz.source,
      questions: quiz.questions
    });
    setIsCreatingQuiz(true);
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/assignments/${newAssignmentForm.id}`, newAssignmentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Assignment updated!");
      setIsCreatingAssignment(false);
      setNewAssignmentForm({ title: "", courseId: "", description: "", deadline: "", maxScore: 100 });
      fetchTeacherAssignments();
    } catch (err) { toast.error("Update failed."); }
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/quizzes/${quizForm.id}`, quizForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Quiz updated!");
      setIsCreatingQuiz(false);
      setQuizForm({ title: "", courseId: "", duration: 10, source: "custom", questions: [] });
      fetchTeacherQuizzes();
    } catch (err) { toast.error("Update failed."); }
  };

  const fetchRoster = async (course) => {
    try {
      setLoadingRoster(true);
      setSelectedCourse(course);
      setActiveTab("roster");
      const res = await axios.get(`http://localhost:5000/api/teacher/course/${course._id}/roster`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data.students || []);
    } catch (err) {
      toast.error("Failed to fetch roster.");
    } finally {
      setLoadingRoster(false);
    }
  };

  const fetchOpenTDBQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const res = await axios.get("http://localhost:5000/api/quizzes/opentdb/fetch", {
        params: opentdbParams,
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizForm({ ...quizForm, questions: res.data.questions, source: "openTDB" });
      toast.success("Questions fetched!");
    } catch (err) {
      toast.error("Failed to fetch questions.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.courseId || quizForm.questions.length === 0) return toast.error("Selection incomplete.");
    try {
      await axios.post("http://localhost:5000/api/quizzes/create", quizForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Quiz created!");
      setIsCreatingQuiz(false);
      setQuizForm({ title: "", courseId: "", duration: 10, source: "custom", questions: [] });
      fetchTeacherQuizzes(); // Refresh list
    } catch (err) { toast.error("Save failed."); }
  };

  const fetchSubmissions = async (asgn) => {
    try {
      setLoadingSubmissions(true);
      setSelectedAssignment(asgn);
      setActiveTab("submissions");
      const res = await axios.get(`http://localhost:5000/api/assignments/submissions/${asgn._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignmentSubmissions(res.data.submissions || []);
    } catch (err) { toast.error("Failed to fetch submissions."); } finally { setLoadingSubmissions(false); }
  };

  const handlePostAssignment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/assignments/create", newAssignmentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Assignment posted!");
      setIsCreatingAssignment(false);
      fetchTeacherAssignments();
    } catch (err) { toast.error("Failed to post."); }
  };

  const handleGradeSubmission = async (subId, grade, feedback) => {
    try {
      await axios.patch(`http://localhost:5000/api/assignments/submissions/${subId}/grade`, { grade, feedback }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Graded!");
      fetchSubmissions(selectedAssignment);
    } catch (err) { toast.error("Grade failed."); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Views ---

  const HomeView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>Teacher Profile</h2>
      {teacherInfo && (
        <div style={{ lineHeight: "1.8", color: "#1e293b" }}>
          <p><strong>Name:</strong> {teacherInfo.name}</p>
          <p><strong>Email:</strong> {teacherInfo.email}</p>
          <p><strong>Department:</strong> {teacherInfo.department || "N/A"}</p>
          <p><strong>Total Courses:</strong> {myCourses.length}</p>
        </div>
      )}
    </div>
  );

  const MyCoursesView = () => (
    <div style={cardStyle}>
      <h2 style={sectionHeaderStyle}>My Assigned Courses</h2>
      {myCourses.length === 0 ? <p>No courses assigned yet.</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {myCourses.map(c => (
            <div key={c._id} style={{ ...cardStyle, border: "1px solid #ddd", padding: "15px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "black" }}>{c.name}</h4>
              <p style={{ fontSize: "13px", color: "#64748b" }}>{c.department}</p>
              <p style={{ fontSize: "14px", color: "black" }}><strong>Enrolled:</strong> {c.enrolledCount} / {c.capacity}</p>
              <button onClick={() => fetchRoster(c)} style={{ ...regButtonStyle, marginTop: "10px", width: "100%" }}>View Roster</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const RosterView = () => (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>Student Roster: {selectedCourse?.name}</h2>
        <button onClick={() => setActiveTab("courses")} style={{ ...regButtonStyle, background: "#64748b" }}>Back</button>
      </div>
      {loadingRoster ? <p>Loading roster...</p> : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Roll No</th>
              <th style={thStyle}>Program</th>
              <th style={thStyle}>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="4" style={{ ...tdStyle, textAlign: "center" }}>No students registered yet.</td></tr>
            ) : students.map(s => (
              <tr key={s._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.rollNo || "N/A"}</td>
                <td style={tdStyle}>{s.program || "N/A"}</td>
                <td style={tdStyle}>{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const QuizManagerView = () => {
    if (isCreatingQuiz) return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={sectionHeaderStyle}>{quizForm.id ? "Edit Quiz" : "Create Quiz"}</h2>
          <button onClick={() => {
            setIsCreatingQuiz(false);
            setQuizForm({ title: "", courseId: "", duration: 10, source: "custom", questions: [] });
          }} style={{ ...regButtonStyle, background: "#64748b" }}>Cancel</button>
        </div>
        <form onSubmit={quizForm.id ? handleUpdateQuiz : handleSaveQuiz} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", gap: "15px" }}>
            <input type="text" placeholder="Title" style={{ ...inputStyle, flex: 2 }} value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} required />
            <select style={{ ...inputStyle, flex: 1 }} value={quizForm.courseId} onChange={e => setQuizForm({ ...quizForm, courseId: e.target.value })} required>
              <option value="">Course</option>
              {myCourses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          {!quizForm.id && (
            <div style={{ padding: "15px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Fetch from OpenTDB</h4>
              <div style={{ display: "flex", gap: "10px" }}>
                <select style={inputStyle} value={opentdbParams.category} onChange={e => setOpentdbParams({ ...opentdbParams, category: e.target.value })}>
                  <option value="18">Computer Science</option>
                  <option value="19">Mathematics</option>
                  <option value="21">Sports</option>
                  <option value="23">History</option>
                  <option value="27">Animals</option>
                  <option value="9">General Knowledge</option>
                </select>
                <select style={inputStyle} value={opentdbParams.difficulty} onChange={e => setOpentdbParams({ ...opentdbParams, difficulty: e.target.value })}>
                  <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                </select>
                <button type="button" onClick={fetchOpenTDBQuestions} disabled={loadingQuestions} style={regButtonStyle}>{loadingQuestions ? "..." : "Fetch"}</button>
              </div>
            </div>
          )}
          {quizForm.questions.length > 0 && (
            <div>
              <h4 style={{ marginTop: "20px" }}>Questions ({quizForm.questions.length})</h4>
              {quizForm.questions.map((q, idx) => (
                <div key={idx} style={{ padding: "10px", borderBottom: "1px solid #eee", fontSize: "14px" }}>
                  <p style={{ margin: "0 0 5px 0", color: "black" }}><strong>{idx + 1}.</strong> {q.question}</p>
                  <p style={{ margin: 0, color: "green", fontSize: "12px" }}>Correct: {q.correctAnswer}</p>
                </div>
              ))}
              <button type="submit" style={{ ...regButtonStyle, background: "green", width: "100%", marginTop: "10px" }}>{quizForm.id ? "Update Quiz" : "Save Quiz"}</button>
            </div>
          )}
        </form>
      </div>
    );
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={sectionHeaderStyle}>Quiz Manager</h2>
          <button onClick={() => setIsCreatingQuiz(true)} style={regButtonStyle}>➕ Create New Quiz</button>
        </div>
        {teacherQuizzes.length === 0 ? <p>No quizzes created yet.</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {teacherQuizzes.map(q => (
              <div key={q._id} style={{ ...cardStyle, border: "1px solid #ddd", padding: "15px" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "black" }}>{q.title}</h4>
                <p style={{ fontSize: "13px", color: "#2563eb", marginBottom: "10px" }}>{q.courseId?.name}</p>
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "15px" }}>
                  <p>Questions: {q.questions?.length}</p>
                  <p>Duration: {q.duration} mins</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEditQuiz(q)} style={{ ...regButtonStyle, background: "#f59e0b", flex: 1 }}>Edit</button>
                  <button onClick={() => handleDeleteQuiz(q._id)} style={{ ...regButtonStyle, background: "#ef4444", flex: 1 }}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AssignmentManagerView = () => {
    if (isCreatingAssignment) return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={sectionHeaderStyle}>{newAssignmentForm.id ? "Edit Assignment" : "Post Assignment"}</h2>
          <button onClick={() => {
            setIsCreatingAssignment(false);
            setNewAssignmentForm({ title: "", courseId: "", description: "", deadline: "", maxScore: 100 });
          }} style={{ ...regButtonStyle, background: "#64748b" }}>Cancel</button>
        </div>
        <form onSubmit={newAssignmentForm.id ? handleUpdateAssignment : handlePostAssignment} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input type="text" placeholder="Title" style={inputStyle} value={newAssignmentForm.title} onChange={e => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })} required />
          <select style={inputStyle} value={newAssignmentForm.courseId} onChange={e => setNewAssignmentForm({ ...newAssignmentForm, courseId: e.target.value })} required>
            <option value="">Course</option>
            {myCourses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <textarea placeholder="Description" style={{ ...inputStyle, height: "120px" }} value={newAssignmentForm.description} onChange={e => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })} required />
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "5px" }}>Deadline</label>
              <input type="date" style={{ ...inputStyle, width: "100%" }} value={newAssignmentForm.deadline} onChange={e => setNewAssignmentForm({ ...newAssignmentForm, deadline: e.target.value })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "5px" }}>Max Score</label>
              <input type="number" style={{ ...inputStyle, width: "100%" }} value={newAssignmentForm.maxScore} onChange={e => setNewAssignmentForm({ ...newAssignmentForm, maxScore: e.target.value })} required />
            </div>
          </div>
          <button type="submit" style={regButtonStyle}>{newAssignmentForm.id ? "Update" : "Post"}</button>
        </form>
      </div>
    );
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={sectionHeaderStyle}>Assignments</h2>
          <button onClick={() => setIsCreatingAssignment(true)} style={regButtonStyle}>➕ Post New</button>
        </div>
        {teacherAssignments.length === 0 ? <p>No assignments posted yet.</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {teacherAssignments.map(a => (
              <div key={a._id} style={{ ...cardStyle, border: "1px solid #ddd", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h4 style={{ margin: 0, color: "black", fontSize: "16px" }}>{a.title}</h4>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#2563eb", background: "#dbeafe", padding: "4px 8px", borderRadius: "4px", alignSelf: "flex-start" }}>{a.courseId?.name}</p>
                <p style={{ fontSize: "14px", color: "#334155", whiteSpace: "pre-wrap" }}>{a.description}</p>
                <div style={{ marginTop: "auto" }}>
                  <p style={{ fontSize: "12px", color: "#64748b" }}><strong>Deadline:</strong> {new Date(a.deadline).toLocaleDateString()}</p>
                  <p style={{ fontSize: "12px", color: "#64748b" }}><strong>Max Score:</strong> {a.maxScore}</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button onClick={() => fetchSubmissions(a)} style={{ ...regButtonStyle, flex: 2 }}>Submissions</button>
                    <button onClick={() => handleEditAssignment(a)} style={{ ...regButtonStyle, background: "#f59e0b", flex: 1 }}>Edit</button>
                    <button onClick={() => handleDeleteAssignment(a._id)} style={{ ...regButtonStyle, background: "#ef4444", flex: 1 }}>Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SubmissionsView = () => {
    const [gradingSub, setGradingSub] = useState(null);
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");

    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>Submissions: {selectedAssignment?.title}</h2>
          <button onClick={() => setActiveTab("assignments")} style={{ ...regButtonStyle, background: "#64748b" }}>Back</button>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={thStyle}>Student</th><th style={thStyle}>File</th><th style={thStyle}>Grade</th><th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignmentSubmissions.map(sub => (
              <tr key={sub._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{sub.studentId?.name}</td>
                <td style={tdStyle}><a href={`http://localhost:5000/${sub.fileUrl}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>File</a></td>
                <td style={tdStyle}>{sub.grade || "N/A"}</td>
                <td style={tdStyle}><button onClick={() => { setGradingSub(sub); setGrade(sub.grade || ""); setFeedback(sub.feedback || ""); }} style={regButtonStyle}>Grade</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {gradingSub && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1002 }}>
            <div style={{ ...cardStyle, width: "400px" }}>
              <h3>Grade: {gradingSub.studentId?.name}</h3>
              <input type="number" style={{ ...inputStyle, width: "100%", margin: "10px 0" }} value={grade} onChange={e => setGrade(e.target.value)} placeholder="Score" />
              <textarea style={{ ...inputStyle, width: "100%", height: "80px" }} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Feedback" />
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button onClick={() => { handleGradeSubmission(gradingSub._id, grade, feedback); setGradingSub(null); }} style={{ ...regButtonStyle, background: "green", flex: 1 }}>Submit</button>
                <button onClick={() => setGradingSub(null)} style={{ ...regButtonStyle, background: "#64748b", flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading Dashboard...</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", backgroundColor: "#f1f5f9" }}>
      <div style={sidebarStyle}>
        <div>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px", fontSize: "22px" }}>Portal</h2>
          <button onClick={() => setActiveTab("home")} style={menuItemStyle(activeTab === "home")}>🏠 Home</button>
          <button onClick={() => setActiveTab("courses")} style={menuItemStyle(activeTab === "courses")}>📚 Courses</button>
          <button onClick={() => setActiveTab("quizzes")} style={menuItemStyle(activeTab === "quizzes")}>📝 Quizzes</button>
          <button onClick={() => setActiveTab("assignments")} style={menuItemStyle(activeTab === "assignments")}>📂 Assignments</button>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} style={logoutButtonStyle}>Logout</button>
      </div>
      <div style={{ flex: 1, padding: "40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {error && <div style={errorBoxStyle}>{error}</div>}
          {activeTab === "home" && <HomeView />}
          {activeTab === "courses" && <MyCoursesView />}
          {activeTab === "roster" && <RosterView />}
          {activeTab === "quizzes" && <QuizManagerView />}
          {activeTab === "assignments" && <AssignmentManagerView />}
          {activeTab === "submissions" && <SubmissionsView />}
        </div>
      </div>
    </div>
  );
};

const sidebarStyle = { width: "260px", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "30px 20px", height: "100vh", position: "sticky", top: 0 };
const menuItemStyle = (isActive) => ({ width: "100%", padding: "12px 15px", marginBottom: "10px", textAlign: "left", backgroundColor: isActive ? "#2563eb" : "transparent", color: isActive ? "white" : "#94a3b8", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: isActive ? "600" : "400", display: "block" });
const logoutButtonStyle = { padding: "12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const cardStyle = { backgroundColor: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
const sectionHeaderStyle = { color: "#1e293b", marginBottom: "20px", fontSize: "18px" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "12px", textAlign: "left", fontSize: "13px" };
const tdStyle = { padding: "12px", color: "#334155", fontSize: "14px" };
const regButtonStyle = { padding: "6px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" };
const errorBoxStyle = { padding: "12px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "20px" };
const inputStyle = { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" };

export default TeacherDashboard;
