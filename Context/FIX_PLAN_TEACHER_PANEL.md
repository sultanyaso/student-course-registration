# Detailed Fix Plan: Teacher Panel Display & CRUD Management

This document provides specific instructions to fix the Teacher Dashboard display issues and implement the requested management features.

## 1. Backend Fixes: Resolving Crashes & Missing Imports

### A. Fix `backend/controllers/assignmentController.js`
- **Issue:** `Course` model is used in `getTeacherAssignments` but not imported.
- **Action:** Add `const Course = require("../models/course");` at the top of the file.
- **Verify:** Ensure `updateAssignment` and `deleteAssignment` handles are correctly implemented and exported.

### B. Fix `backend/controllers/quizController.js`
- **Issue:** `Course` model is used in `getTeacherQuizzes` but not imported.
- **Action:** Add `const Course = require("../models/course");` at the top of the file.
- **Refinement:** Ensure `decodeHTML` is consistently applied to all OpenTDB responses.
- **Verify:** Ensure `updateQuiz` and `deleteQuiz` handles are correctly implemented and exported.

---

## 2. Frontend Fixes: `TeacherDashboard.jsx`

### A. Data Fetching Synchronization
- Move `fetchTeacherQuizzes` and `fetchTeacherAssignments` above the `fetchData` function to avoid hoisting issues or reference errors.
- Ensure `fetchData` waits for all sub-fetches to complete before setting `loading` to false.

### B. Assignment Management UI (Phase 3 Fix)
- **Display Fix:** Rewrite the `AssignmentManagerView` to iterate over `teacherAssignments`.
- **Card Content:** 
    - Title (Black, bold)
    - **Description** (Full text shown clearly)
    - Course Name (from populated `courseId.name`)
    - Deadline (Formatted date)
- **Actions:**
    - "Submissions" button (opens roster/grade view)
    - "Edit" button (loads assignment into `newAssignmentForm` and opens form)
    - "Del" button (Red, calls `handleDeleteAssignment`)

### C. Quiz Management UI (Phase 2 Fix)
- **Display Fix:** Rewrite the `QuizManagerView` to iterate over `teacherQuizzes`.
- **Card Content:**
    - Title
    - Course Name
    - Metadata: Question count, duration.
- **Actions:**
    - "Edit" button (Pre-fills `quizForm`)
    - "Delete" button (Calls `handleDeleteQuiz`)

---

## 3. CRUD Logic Refinement

### A. Edit Mode Implementation
- Create a `selectedId` or `isEditing` state to toggle between POST and PUT requests.
- Ensure clicking "Cancel" clears the form and resets the mode.

### B. List Refresh
- Call the respective fetchers (`fetchTeacherAssignments` or `fetchTeacherQuizzes`) immediately after any success toast for Create, Update, or Delete.

---

## 4. Admin Dashboard Fix: Report Panel
- **Issue:** Report panel shows a blank black screen.
- **Investigation:** Check `AdminDashboard.jsx` for missing null-checks in `stats.revenue` or chart rendering logic.
- **Action:** Add safety checks (e.g., `stats?.revenue || 0`) and verify container heights.

---

## 5. Verification Steps (Based on `db_log.txt`)
1. Log in as `SAK_T`.
2. Dashboard should load without "Failed to fetch" error.
3. "Assignments" tab should display 3 cards: `Assignment_1`, `Assignment_2`, `Assignment_3`.
4. Card for `Assignment_1` must show: "Create A simple hello world program in c++".
5. Test: Edit `Assignment_1` description to include "Updated".
6. Test: Delete a quiz and verify it disappears from the list.
