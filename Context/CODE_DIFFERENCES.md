# Code Differences Analysis: Current vs MUST_MERGE

This document outlines the differences between the current implementation and the code provided in the `MUST_MERGE/` directory.

## 1. Backend Comparison

### Models
- **Course Model (`course.js`):**
  - **Current:** Includes `description`, `teacherId` (ObjectId ref), `capacity`, `enrolledCount`, `schedule`, and `department`.
  - **MUST_MERGE:** Only contains `name`, `instructor`, `creditHours`, and `feePerCredit`.
- **User Model (`user.js`):**
  - **Current:** Includes roles `['student', 'teacher', 'admin']` and detailed profile fields (`rollNo`, `campus`, `program`, `department`, `status`).
  - **MUST_MERGE:** Basic roles `['student', 'teacher']`, missing detailed profile fields.
- **New Models (Current Only):** `Quiz`, `QuizAttempt`, `Assignment`, `Submission`.

### Controllers
- **Course Controller:**
  - **Current:** Supports regex-based search, department filtering, and credit range filtering.
  - **MUST_MERGE:** Standard CRUD only.
- **Student Controller:**
  - **Current:** Advanced registration logic with real-time seat management (capacity check).
  - **MUST_MERGE:** Simple registration without capacity checks.
- **New Controllers (Current Only):** `quizController`, `assignmentController` (with Multer file uploads), `chatController` (Gemini AI).

### Routes
- **Current:** Comprehensive routing for Quizzes, Assignments, and AI Chat.
- **MUST_MERGE:** Basic Auth, Admin, and Student routes.

## 2. Frontend Comparison

### Student Dashboard
- **Current:** Feature-rich with Tabs for Home (Profile Edit), Course Registration (Search/Filter), Quiz Hub (Interactive Timer), Assignments (File Upload), My Schedule, and Fee Slip.
- **MUST_MERGE:** Basic implementation with only Profile, Course Registration, and Fee Slip.

### Admin Dashboard
- **Current & MUST_MERGE:** Both share a similar layout for student approval and course management. However, the current version is more robust in handling updated course models.

### Missing Features in MUST_MERGE
- **Teacher Dashboard:** Although mentioned by the user, `MUST_MERGE` does not contain a dedicated `TeacherDashboard.jsx`. It seems to rely on the `AdminDashboard.jsx` or shared logic.
- **AI Chatbot:** No implementation in `MUST_MERGE`.
- **Quiz/Assignment Hubs:** No implementation in `MUST_MERGE`.

## 3. Integration Strategy
1. **Preserve Current Logic:** The current codebase is significantly more advanced. I will keep all existing student features and backend enhancements.
2. **Implement Teacher Panel:** Create a dedicated `TeacherDashboard.jsx` and backend routes to fulfill the "Teacher" requirement, leveraging the `teacherId` and assignment/quiz creation logic.
3. **Align Roles:** Ensure the Auth system correctly redirects `teacher` roles to the new Teacher Dashboard.
4. **Merge Admin Enhancements:** Audit the `MUST_MERGE` Admin features to ensure no specific student-management UI logic was missed.
