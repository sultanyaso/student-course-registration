# Setup and Execution Guide

Follow these steps to set up and run the Student Course Registration Portal locally.

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (Local installation or MongoDB Atlas URI)
- **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` folder (refer to `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_string
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the server:**
   - For development (with nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
   The server will run on `http://localhost:5000`.

---

## 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## 3. Usage & Testing

### User Roles
- **Student:** Can register, take quizzes, and submit assignments.
- **Teacher/Admin:** Can manage courses and students.
  *Note: To create an Admin, manually change the `role` field to `'admin'` in the MongoDB database for a registered user.*

### Important Folders
- `backend/uploads/`: This folder will be automatically created to store assignment submissions.

---

## Troubleshooting
- **CORS Errors:** Ensure the backend is running on port 5000 as the frontend is currently configured to point to `http://localhost:5000`.
- **Database Connection:** Verify that your IP is whitelisted in MongoDB Atlas if using a cloud database.
- **AI Chatbot:** If the chatbot isn't responding, check if your `GEMINI_API_KEY` is valid and hasn't hit rate limits.
