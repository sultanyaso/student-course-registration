# Comprehensive Test Script

Follow these steps to verify all features of the Student Course Registration Portal.

## Phase 1: Environment & Setup
1. **Database:** Ensure MongoDB is running (Compass connected or Atlas URI).
2. **Backend:** 
   - Navigate to `backend/`.
   - Run `npm install`.
   - Start the server: `npm run dev`.
3. **Frontend:** 
   - Navigate to `frontend/`.
   - Run `npm install`.
   - Start the app: `npm run dev`.
4. **Environment Variables:** Ensure `.env` in `backend/` has `JWT_SECRET`, `MONGO_URI`, and `GEMINI_API_KEY`.

---

## Phase 2: Authentication & Admin Escalation

### 1. Register Users
- [ ] **Student:** Register a new user (`student@example.com`).
- [ ] **Teacher:** Register a new user (`teacher@example.com`, name: "Dr. Smith").
- [ ] **Admin:** Register a new user (`i221510@nu.edu.pk`).

### 2. Admin Escalation (The Backdoor)
- [ ] **Significance:** This project uses a utility endpoint to promote the initial administrator without needing direct database access tools.
- [ ] **Action:** Open your browser or Postman and go to:
  `http://localhost:5000/api/make-admin/i221510@nu.edu.pk`
- [ ] **Verification:** You should see a message: "User i221510@nu.edu.pk is now an ADMIN."

### 3. Login Redirects
- [ ] Log in as **Student** -> Should land on `/student` dashboard.
- [ ] Log in as **Teacher** -> Should land on `/teacher` dashboard.
- [ ] Log in as **Admin** -> Should land on `/admin` dashboard.

---

## Phase 3: Admin Workflow

### 1. Student Approval
- [ ] Navigate to **Students** tab in Admin Dashboard.
- [ ] Locate `student@example.com`.
- [ ] Click **Approve**. The status must change to "Approved ✅".

### 2. Global Course Management
- [ ] Navigate to **Courses** tab.
- [ ] **Create:** Fill the form (Name: "Advanced Algorithms", Instructor: "Dr. Smith", Credits: 3, Fee: 1500).
- [ ] **Edit:** Click ✏️ on a course, change the Fee, and save.
- [ ] **Delete:** Click 🗑 on a course to remove it.

---

## Phase 4: Teacher Workflow

### 1. Course & Roster Management
- [ ] Log in as **Dr. Smith**.
- [ ] Navigate to **My Courses**.
- [ ] Verify "Advanced Algorithms" appears.
- [ ] Click **View Roster** (Verify it lists students once they register).

### 2. Content Creation
- [ ] Navigate to **Quizzes** tab.
- [ ] Click **➕ Create New Quiz** (currently integrated with Quiz Hub logic).
- [ ] Navigate to **Assignments** tab.
- [ ] Click **➕ Post New Assignment**.

---

## Phase 5: Student Workflow (Full Cycle)

### 1. Academic Profile
- [ ] Log in as **Student**.
- [ ] On **Home**, click **✏️ Edit Profile**.
- [ ] Fill in Roll No (`22I-XXXX`), Campus (`Islamabad`), and Program (`BS-CS`).
- [ ] Save and refresh to ensure data persists.

### 2. Course Registration (Logic Check)
- [ ] Navigate to **Registration**.
- [ ] **Search:** Type "Algo" in the bar -> Course should filter.
- [ ] **Register:** Click Register.
  - [ ] Check **Seats**: Count should decrease (e.g., 50 -> 49).
  - [ ] Check **My Registered Courses**: Should appear below the table.
- [ ] **Unregister:** Click Unregister.
  - [ ] Seats should increase back.

### 3. Quiz Hub (Timed Assessment)
- [ ] Navigate to **Quizzes**.
- [ ] Click **Take Quiz**.
- [ ] Verify the **Timer** counts down.
- [ ] Complete the quiz and verify the **Score** is calculated and displayed in the list.

### 4. Assignment Portal (File Submission)
- [ ] Navigate to **Assignments**.
- [ ] Select a PDF/Doc file for a pending assignment.
- [ ] Click **Submit**. Status should change to **SUBMITTED**.

### 5. Financials & Schedule
- [ ] Navigate to **Schedule**. Verify your registered course timings.
- [ ] Navigate to **Fee Slip**. Verify the total: `(3 Credits * 1500 Fee) = 4500`.

### 6. AI Support (Gemini)
- [ ] Open the **💬 AI Assistant** widget.
- [ ] Ask: "Help me with course registration."
- [ ] Verify the AI provides a contextual response related to the portal.

---

## Phase 6: Security Verification
- [ ] **Logout:** Click Logout.
- [ ] **Direct Access:** Try typing `http://localhost:5173/admin` in the URL bar.
- [ ] **Verification:** Should be forced back to the `/` (Login) page immediately.
