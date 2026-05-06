# Next Steps Implementation Plan

This document serves as the roadmap for completing the remaining modules of the Student Course Registration Portal, specifically focusing on the Teacher and Admin panels.

## Phase 1: Teacher Dashboard - Course & Roster Management
**Goal:** Empower teachers to see their impact and manage their students.

- [ ] **Backend: Teacher-Specific Course Route**
    - Create `GET /api/teacher/my-courses` to fetch courses where `teacherId` matches `req.user.id`.
- [ ] **Backend: Student Roster API**
    - Create `GET /api/teacher/course/:courseId/roster` to list students enrolled in a specific course.
- [ ] **Frontend: Roster View**
    - Implement a detailed table in `TeacherDashboard.jsx` showing student names, emails, and enrollment dates.

## Phase 2: Teacher Dashboard - Quiz Creator (OpenTDB Integration)
**Goal:** Automate quiz generation using the Open Trivia Database.

- [ ] **Backend: OpenTDB Proxy**
    - Implement `GET /api/quizzes/opentdb/fetch` that calls `opentdb.com/api.php`.
    - Map OpenTDB categories (18: CS, 19: Math) to the system's requirements.
- [ ] **Frontend: Quiz Creation UI**
    - Category & Difficulty selection dropdowns.
    - Question preview list with "Save to Course" functionality.
    - Manual question addition form for "Custom" source quizzes.

## Phase 3: Teacher Dashboard - Assignment Manager & Gradebook
**Goal:** Streamline the grading process and feedback loop.

- [ ] **Backend: Grading API**
    - Implement `PATCH /api/assignments/submissions/:submissionId/grade` to update score and feedback.
- [ ] **Frontend: Submission Tracker**
    - View showing all files uploaded for a specific assignment.
- [ ] **Frontend: Gradebook Table**
    - A matrix view (Student x Assignment) for quick grade entry.

## Phase 4: Admin Dashboard - Reports & Analytics
**Goal:** Provide high-level insights into the system's usage.

- [ ] **Backend: Analytics API**
    - Implement `GET /api/admin/stats` (Total students, teachers, active courses, total fees collected).
- [ ] **Frontend: Analytics Dashboard**
    - Use basic CSS-based bars or a library (if available) to show enrollment trends.
    - Export Roster feature (CSV download placeholder).

## Phase 5: System Polishing & Security
**Goal:** Finalize the user experience and ensure robustness.

- [ ] **Middleware Audit**
    - Ensure `adminMiddleware` is applied to all sensitive routes.
    - Validate that students cannot access teacher-only routes (e.g., grading).
- [ ] **Error Handling & UX**
    - Implement loading skeletons for dashboard cards.
    - Add toast notifications (React Hot Toast) for all actions (Register/Submit/Save).
- [ ] **Cleanup**
    - Remove the Admin "Backdoor" route from `server.js` before "production".

---

## Current Priority: Phase 1 & 2
- Building the Teacher's Course/Roster view.
- Setting up the OpenTDB fetch logic.
