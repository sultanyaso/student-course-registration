**WEB-LAB SEMESTER PROJECT PROPOSAL**

**Student Course Registration Portal**

*Intelligent Student Course Registration & Learning Management System*

# **1. Project Information**

  -----------------------------------------------------------------------
  **Field**          **Details**
  ------------------ ----------------------------------------------------
  Project Title      Student Course Registration Portal -- Intelligent
                     Student Course Registration & Learning Management
                     System

  -----------------------------------------------------------------------

# **2. Group Details**

  ------------------------------------------------------------------------
  **Sr.   **Name**           **Roll Number**    **Email**
  No**                                          
  ------- ------------------ ------------------ --------------------------
  1       Sanaan Azfar       22i-2594           i222594@nu.edu.pk

  2       Yasir Sultan       22i-1510           i221510@nu.edu.pk
  ------------------------------------------------------------------------

# **3. Project Overview**

## **Problem Statement**

Manual course registration in educational institutions leads to
scheduling conflicts, enrollment errors, lack of real-time seat
availability, and inefficient communication between students and
teachers. Students struggle to discover relevant courses, teachers lack
tools for quick assessment creation, and admins have no centralized
dashboard for oversight.

## **Proposed Solution**

A MERN-stack web application with three role-based panels (Admin,
Teacher, Student) that:

-   Enables real-time course browsing, filtering, and enrollment with
    seat management

```{=html}
<!-- -->
```
-   Integrates OpenTDB API for auto-generating categorized quiz
    questions

```{=html}
<!-- -->
```
-   Embeds a Gemini-powered AI chatbot for instant student support

```{=html}
<!-- -->
```
-   Provides JWT-secured authentication, full CRUD operations, and
    responsive UI

## **Target Users**

-   Students: Browse courses, enroll, take quizzes, submit assignments,
    get AI support

```{=html}
<!-- -->
```
-   Teachers: Manage courses, view rosters, create quizzes via OpenTDB,
    grade submissions

```{=html}
<!-- -->
```
-   Admins: Oversee users/courses/enrollments, generate reports, manage
    system settings

# **4. Technology Stack**

  -----------------------------------------------------------------------
  **Layer**          **Technology**
  ------------------ ----------------------------------------------------
  Frontend           React.js, React Router v6, Tailwind CSS, Axios,
                     React Hook Form

  State Management   Context API + useReducer (lightweight, no Redux
                     overhead)

  Backend            Node.js, Express.js, JWT, bcryptjs,
                     express-validator

  Database           MongoDB (Atlas Cloud), Mongoose ODM

  External APIs      OpenTDB (quiz questions), Google Gemini (chatbot)

  DevOps             Git (separate repos per member), Vercel (frontend),
                     Render/Railway (backend)

  Testing            Postman (API), Jest (backend unit tests)
  -----------------------------------------------------------------------

# **5. Figma Design Prototype**

## **Auth Screens (Shared)**

-   Login / Signup (role selection: Student / Teacher / Admin)

```{=html}
<!-- -->
```
-   Forgot Password / Reset Flow

```{=html}
<!-- -->
```
-   Email Verification Placeholder

## **Admin & Teacher Panel Screens (6 Modules)**

  -----------------------------------------------------------------------
  **Module**         **Role**     **Screens**
  ------------------ ------------ ---------------------------------------
  1\. Course         Admin        Course Catalog (Admin view),
  Management                      Create/Edit Course Form, Assign Teacher
                                  Modal, Capacity Scheduler

  2\. System         Admin        Dashboard Cards (total users, courses,
  Analytics                       enrollments), Chart.js graphs,
                                  Date-range picker

  3\. My Courses     Teacher      Course Cards Grid, Edit Course Details,
                                  Schedule Calendar View

  4\. Student Roster Teacher      Enrolled Students Table, Search by
                                  Name/Email, Contact Button (mailto)

  5\. Quiz Bank &    Admin /      OpenTDB Fetch UI (category/difficulty
  Creator            Teacher      filters), Preview Questions, Save to
                                  Course Button, Category Selector,
                                  Difficulty Slider, Question Preview,
                                  Publish Toggle

  6\. Assignment     Teacher      Assignment List, Create Assignment Form
  Manager & Grade                 (title, desc, deadline, max score),
  Book                            Submission Tracker, Grade Table
                                  (student x assignment), Inline Edit
                                  Grades, Export PDF, Analytics Chart
  -----------------------------------------------------------------------

## **Student Panel Screens (5 Modules)**

  -----------------------------------------------------------------------
  **Module**         **Screens**
  ------------------ ----------------------------------------------------
  1\. Course Catalog Search Bar, Filter Chips (dept/teacher/time), Course
                     Cards with Enroll CTA, Seat Counter

  2\. My Enrollments Enrolled Courses Grid, Schedule View (weekly
                     calendar), Drop Course Button

  3\. Quiz Hub       Available Quizzes List, Timer-based Quiz Interface,
                     Results Screen with Correct/Incorrect Breakdown

  4\. Assignment     Assignment Cards (status: pending/submitted/graded),
  Portal             File Upload Component, Submission History

  5\. Profile &      Edit Profile Form, Grade Summary Card, AI Chatbot
  Support            Floating Widget, Help Center Links
  -----------------------------------------------------------------------

## **UX Decisions**

-   Mobile-first responsive design (Tailwind breakpoints)

```{=html}
<!-- -->
```
-   Consistent navigation: Sidebar for panels, topbar for auth/shared
    actions

```{=html}
<!-- -->
```
-   Loading states: Skeleton screens for API data, spinners for form
    submissions

```{=html}
<!-- -->
```
-   Error handling: Toast notifications (react-hot-toast) for API
    errors, form validation messages

# **6. Functional Requirements**

## **6.1 Core Features (Mandatory)**

-   User Authentication: JWT-based login/register with role-based route
    protection

```{=html}
<!-- -->
```
-   Complete CRUD Operations: All modules support Create, Read, Update,
    Delete as applicable

```{=html}
<!-- -->
```
-   Search Functionality: Global search bar (courses, users) +
    module-specific search

```{=html}
<!-- -->
```
-   Filtering Functionality: Filter courses by department/teacher/time;
    filter quizzes by difficulty/category

```{=html}
<!-- -->
```
-   External API Integration: OpenTDB (quiz questions by
    category/difficulty) + Google Gemini (AI chatbot)

## **6.2 Optional Features**

-   AI Chatbot: Gemini-powered assistant scoped to course context

```{=html}
<!-- -->
```
-   Real-time Notifications: Socket.io for enrollment confirmations,
    assignment deadline alerts

```{=html}
<!-- -->
```
-   Export Features: CSV/PDF export for rosters, grades, reports

# **7. Frontend Design Details**

## **State Management Approach**

-   AuthContext: Global user state (isLoggedIn, role, userData) with
    localStorage persistence

```{=html}
<!-- -->
```
-   useReducer + Context: For complex forms (QuizCreator,
    AssignmentManager) to avoid prop drilling

```{=html}
<!-- -->
```
-   Local Component State: For UI interactions (modals, filters, chat
    input)

## **API Integration Strategy**

-   Axios instance with baseURL + interceptors for JWT attachment

```{=html}
<!-- -->
```
-   Custom hooks (useCourses, useQuizzes) to encapsulate API calls with
    loading/error states

```{=html}
<!-- -->
```
-   Optimistic UI: Update UI immediately on CRUD actions, revert on API
    error

```{=html}
<!-- -->
```
-   Debounced search: 300ms delay on course/student search inputs to
    reduce API calls

# **8. Backend Design Details**

## **API Architecture (RESTful)**

-   Versioned endpoints: /api/v1/\...

```{=html}
<!-- -->
```
-   Resource-based routing: /api/v1/courses, /api/v1/enrollments

```{=html}
<!-- -->
```
-   Consistent response format: { success: boolean, data?: any, error?:
    string }

## **Authentication & Authorization Strategy**

-   JWT: Access token (15 min expiry) + refresh token (7 days) stored in
    httpOnly cookies

```{=html}
<!-- -->
```
-   Role-based middleware: authorizeRoles(\'admin\', \'teacher\') to
    protect routes

```{=html}
<!-- -->
```
-   Password hashing: bcryptjs with salt rounds = 12

## **Error Handling Approach**

-   Backend: Try/catch in controllers with standardized error responses

```{=html}
<!-- -->
```
-   Frontend: Axios interceptors with toast notifications + redirect on
    401

```{=html}
<!-- -->
```
-   Logging: Winston console logs for development; file logging for
    production

# **9. API Design -- Sample Endpoints**

  ------------------------------------------------------------------------------------
  **Method**   **Endpoint**                      **Description**
  ------------ --------------------------------- -------------------------------------
  POST         /api/v1/auth/register             Register new user
                                                 (student/teacher/admin)

  POST         /api/v1/auth/login                Authenticate user, return JWT + role

  GET          /api/v1/courses                   List all courses (with search/filter
                                                 params)

  POST         /api/v1/courses                   Create new course (teacher/admin
                                                 only)

  PUT          /api/v1/courses/:id               Update course details

  DELETE       /api/v1/courses/:id               Delete course (admin only)

  POST         /api/v1/enrollments               Enroll student in course

  GET          /api/v1/enrollments/student/:id   Get enrolled courses for student

  GET          /api/v1/quizzes/openTDB           Proxy to OpenTDB with category
                                                 mapping

  POST         /api/v1/chat                      Proxy to Gemini API with
                                                 course-context prompt

  GET          /api/v1/analytics/enrollments     Aggregated enrollment stats (admin)
  ------------------------------------------------------------------------------------

# **10. Database Design**

## **10.1 Collections Overview**

-   users -- All system users (students, teachers, admins)

```{=html}
<!-- -->
```
-   courses -- Course catalog with teacher assignment

```{=html}
<!-- -->
```
-   enrollments -- Student-course enrollment records

```{=html}
<!-- -->
```
-   quizzes -- Quiz definitions (OpenTDB-sourced or custom)

```{=html}
<!-- -->
```
-   quiz_attempts -- Student quiz submissions + scores

```{=html}
<!-- -->
```
-   assignments -- Course assignments with deadlines

```{=html}
<!-- -->
```
-   submissions -- Student assignment submissions + grades

```{=html}
<!-- -->
```
-   chat_logs -- Optional: AI chatbot conversation history

## **10.2 Data Dictionary**

**users Collection**

  ------------------------------------------------------------------------
  **Field**       **Data Type**   **Description**
  --------------- --------------- ----------------------------------------
  \_id            ObjectId        Unique identifier

  name            String          Full name

  email           String          Unique email (indexed)

  password        String          Bcrypt-hashed password

  role            String          Enum:
                                  \[\'student\',\'teacher\',\'admin\'\]

  department      String          Academic department (optional)

  createdAt       Date            Account creation timestamp
  ------------------------------------------------------------------------

**courses Collection**

  -----------------------------------------------------------------------
  **Field**       **Data Type**      **Description**
  --------------- ------------------ ------------------------------------
  \_id            ObjectId           Unique identifier

  title           String             Course name

  description     String             Course details

  teacherId       ObjectId (ref:     Assigned teacher
                  users)             

  capacity        Number             Max enrollments

  schedule        String             e.g., Mon/Wed 10-11:30 AM

  department      String             e.g., Computer Science

  createdAt       Date               Creation timestamp
  -----------------------------------------------------------------------

**enrollments Collection**

  -----------------------------------------------------------------------------
  **Field**       **Data Type**      **Description**
  --------------- ------------------ ------------------------------------------
  \_id            ObjectId           Unique identifier

  studentId       ObjectId (ref:     Enrolled student
                  users)             

  courseId        ObjectId (ref:     Enrolled course
                  courses)           

  enrolledAt      Date               Enrollment timestamp

  status          String             Enum:
                                     \[\'active\',\'dropped\',\'completed\'\]
  -----------------------------------------------------------------------------

**quizzes Collection**

  -----------------------------------------------------------------------
  **Field**       **Data Type**      **Description**
  --------------- ------------------ ------------------------------------
  \_id            ObjectId           Unique identifier

  courseId        ObjectId (ref:     Associated course
                  courses)           

  title           String             Quiz title

  source          String             Enum: \[\'openTDB\',\'custom\'\]

  questions       Array              \[{ question, options\[\],
                                     correctAnswer, explanation }\]

  duration        Number             Time limit in minutes

  createdAt       Date               Creation timestamp
  -----------------------------------------------------------------------

# **11. CRUD Operations Mapping**

  -----------------------------------------------------------------------------
  **Operation**   **Description**          **API Endpoint**
  --------------- ------------------------ ------------------------------------
  Create          Add new                  POST /api/v1/users, POST
                  user/course/enrollment   /api/v1/courses, POST
                                           /api/v1/enrollments

  Read            List/view records        GET /api/v1/courses, GET
                                           /api/v1/enrollments/student/:id

  Update          Modify existing record   PUT /api/v1/courses/:id, PUT
                                           /api/v1/users/:id

  Delete          Remove record            DELETE /api/v1/courses/:id (admin
                                           only)
  -----------------------------------------------------------------------------

*Note: Soft delete preferred for enrollments (status: \'dropped\') over
hard delete.*

# **12. Search & Filtering Design**

## **Search Fields**

-   Courses: title, description, teacher name, department

```{=html}
<!-- -->
```
-   Users: name, email, role

```{=html}
<!-- -->
```
-   Students in Roster: name, email, enrollment date

## **Filtering Criteria**

-   Courses: department (dropdown), teacher (autocomplete), schedule
    time, seat availability

```{=html}
<!-- -->
```
-   Quizzes: difficulty (easy/medium/hard), category (OpenTDB mapping),
    source

```{=html}
<!-- -->
```
-   Enrollments: status (active/dropped), date range

## **Implementation Approach: Backend-First**

-   Frontend sends query params: ?search=web&department=CS&minSeats=5

```{=html}
<!-- -->
```
-   Backend uses Mongoose regex for text search with department and
    capacity filters

```{=html}
<!-- -->
```
-   Frontend debounces input (300ms) to reduce API load

```{=html}
<!-- -->
```
-   Filter state persisted in URL params for shareability

# **13. External API Integration**

## **Open Trivia Database (OpenTDB)**

Purpose: Power the Quiz Creator module with categorized,
difficulty-filtered multiple-choice questions for course assessments.

Endpoint:

GET
https://opentdb.com/api.php?amount={count}&category={id}&difficulty={level}&type=multiple

**Category Mapping:**

-   18: Computer Science

```{=html}
<!-- -->
```
-   19: Mathematics

```{=html}
<!-- -->
```
-   21: Sports (for elective courses)

```{=html}
<!-- -->
```
-   27: Animals (for biology electives)

**How Data Will Be Used:**

1.  Teacher selects course and chooses category/difficulty in Quiz
    Creator UI.

```{=html}
<!-- -->
```
1.  Backend proxies request to OpenTDB and transforms response to
    internal schema.

```{=html}
<!-- -->
```
1.  Questions saved to quizzes collection with source: \'openTDB\'
    metadata.

```{=html}
<!-- -->
```
1.  Student takes quiz -- questions rendered from MongoDB, answers
    graded automatically.

## **Google Gemini (via AI Studio)**

Purpose: Provide real-time, course-contextual AI support to students via
chatbot widget.

Endpoint:

POST
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}

**How Data Will Be Used:**

1.  Student types query in chat widget and selects course context.

```{=html}
<!-- -->
```
1.  Frontend sends { message, context } to backend /api/v1/chat.

```{=html}
<!-- -->
```
1.  Backend constructs a scoped system prompt with course context.

```{=html}
<!-- -->
```
1.  Gemini response returned to frontend and displayed in chat UI.

```{=html}
<!-- -->
```
1.  Optional: Log interactions to chat_logs collection for analytics.

# **14. Chatbot Integration**

Tool/Service: Google Gemini API (gemini-1.5-flash model) via Google AI
Studio

**Use Cases:**

-   Student Panel -- Doubt Solver: Answer course-specific questions,
    explain concepts, suggest resources

```{=html}
<!-- -->
```
-   Teacher Panel -- Content Assistant: Generate quiz questions, draft
    assignment descriptions, create rubrics

**Implementation Notes:**

-   Backend proxy to hide API key and enforce rate limiting (15 RPM free
    tier)

```{=html}
<!-- -->
```
-   System prompt scoped to course context to prevent generic answers

```{=html}
<!-- -->
```
-   Fallback UI: \'AI busy, try again\' on 429 errors

```{=html}
<!-- -->
```
-   Optional: Store chat logs for instructor review (privacy-compliant)

# **15. Timeline & Milestones (5-Week Sprint)**

  -------------------------------------------------------------------------
  **Week**   **Task**                           **Deliverable**
  ---------- ---------------------------------- ---------------------------
  Week 1     Proposal finalization, Figma       Approved proposal, Figma
             prototypes for all panels, DB      view-only link
             schema design                      

  Week 2     Backend setup: Express server, JWT Postman collection, Auth
             auth, MongoDB models,              flow working
             OpenTDB/Gemini proxy routes        

  Week 3     Frontend development: React        Login + 1 full module per
             components, panel layouts, API     panel functional
             integration (Axios)                

  Week 4     Integration: Connect frontend to   End-to-end CRUD + API
             backend, implement search/filter,  features working
             chatbot widget                     

  Week 5     Testing, bug fixes, documentation, Source code repos, project
             final demo prep                    report, demo video
  -------------------------------------------------------------------------

# **16. Expected Outcomes**

-   Fully functional MERN application with three role-based panels

```{=html}
<!-- -->
```
-   Responsive, accessible UI built with Tailwind CSS and mobile-first
    design

```{=html}
<!-- -->
```
-   Secure backend with JWT auth, role-based access, input validation,
    and error handling

```{=html}
<!-- -->
```
-   Working API integrations: OpenTDB for quizzes and Gemini for chatbot

```{=html}
<!-- -->
```
-   Search and filtering implemented across courses, users, and quizzes

```{=html}
<!-- -->
```
-   Independent module development enabling parallel work by both
    members

```{=html}
<!-- -->
```
-   Figma-to-code fidelity with documented UX decisions

# **17. Contribution Breakdown**

  -----------------------------------------------------------------------
  **Member**         **Responsibilities**
  ------------------ ----------------------------------------------------
  Member 1 (Sanaan   Admin Panel: All 5 modules (frontend + backend)
  Azfar)             Teacher Panel: Quiz Creator + Grade Book modules
                     Shared: Auth module, Database schema, JWT
                     middleware, OpenTDB integration

  Member 2 (Yasir    Student Panel: All 5 modules (frontend + backend)
  Sultan)            Teacher Panel: My Courses + Student Roster +
                     Assignment Manager Shared: Gemini chatbot
                     integration, Search/Filter logic, Figma prototyping,
                     Testing & documentation
  -----------------------------------------------------------------------

*Note: Modules are designed for independence with no cross-member
blocking during development.*

# **18. References**

## **APIs Used**

-   OpenTDB: <https://opentdb.com/api_config.php> (Sanaan Azfar)

```{=html}
<!-- -->
```
-   Google Gemini API: <https://aistudio.google.com/app/apikey> (yasir
    Sultan+ Sanaan Azfar)

```{=html}
<!-- -->
```
-   Abstract Email Validation (optional):
    https://www.abstractapi.com/email-validation-api

## **Libraries & Tools**

-   Backend: express, mongoose, jsonwebtoken, bcryptjs, axios,
    express-validator

```{=html}
<!-- -->
```
-   Frontend: react, react-router-dom, axios, react-hook-form,
    react-hot-toast, tailwindcss

```{=html}
<!-- -->
```
-   Dev: nodemon, jest, postman, git, vercel, render

## **Documentation**

-   MERN Stack Guide: https://www.mongodb.com/mern-stack

```{=html}
<!-- -->
```
-   JWT Best Practices: https://auth0.com/blog/refresh-tokens-jwt/

```{=html}
<!-- -->
```
-   Figma for Developers:
    https://www.figma.com/resource-library/figma-for-developers/
