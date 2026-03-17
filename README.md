# 🎓 Student Course Registration Portal

A full-stack **MERN (MongoDB, Express, React, Node.js)** application where:

- 👨‍💼 **Admin** manages students and courses  
- 🎓 **Students** can register, view courses, and check fee details  

---

## 🚀 Features

### 👨‍💼 Admin
- View admin profile
- Approve / Reject students
- Add, Update, Delete courses
- Manage course details:
  - Course Name
  - Instructor
  - Credit Hours
  - Fee per Credit

### 🎓 Student
- Register & Login
- View registered courses
- See:
  - Course Name
  - Instructor
  - Credit Hours
- View **Fee Slip (auto calculated)**

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), Axios  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT  

---

## 📂 Project Structure

```

STUDENT-COURSE-REGISTRATION/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md

````

---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/student-course-registration.git
cd student-course-registration
````

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside **backend**:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

  bash
cd frontend
npm install
npm run dev


App runs at:


http://localhost:5173


---

## 🔑 API Overview

### Admin Routes

* `GET /api/admin/me`
* `GET /api/admin/students`
* `PATCH /api/admin/students/:id`
* `POST /api/admin/courses`
* `PUT /api/admin/courses/:id`
* `DELETE /api/admin/courses/:id`

### Student Routes

* `GET /api/student/me`
* `GET /api/student/courses`
* `GET /api/student/registrations`
* `POST /api/student/register/:courseId`
* `POST /api/student/unregister/:courseId`
* `GET /api/student/fee`

---

## 💰 Fee Calculation

Fee is calculated automatically:


Course Fee = Credit Hours × Fee per Credit
Total Fee = Sum of all registered courses


---

## ⚠️ Important Notes

* Make sure MongoDB is running
* Backend runs on **port 5000**
* Frontend runs on **port 5173 (Vite)**
* Token is stored in **localStorage**

---

## 🧪 Future Improvements

* Attendance system
* Marks & transcript module
* Admin analytics dashboard
* Better UI (Tailwind / Material UI)

---

## 📜 License

This project is open-source and free to use.


