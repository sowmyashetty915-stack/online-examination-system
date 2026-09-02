Online Examination System (MERN)
A complete college online examination system built with React + Vite, Node.js + Express, and MongoDB/Mongoose.

Features
College landing page with college details and scrollable role cards.
Registration with email OTP verification and strong password validation.
Login validates email/password and redirects by role.
Protected role-based routes.
Logout confirmation modal: "Are you sure you want to logout?" Yes/No.
Admin: manage students/teachers, approve/reject registrations, assign email/password, activate/deactivate accounts.
Teacher: create exams, manage questions, view submissions and publish result marks.
Student: see available/upcoming exams, take timed MCQ exam, previous/next/save, submit on final question, view published results.
Exam availability based on date/time and duration.
Passwords stored hashed with bcrypt; JWT authentication.
Requirements
Node.js 18+
MongoDB 6+ or MongoDB Atlas
Setup
1. Server
cd server
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
npm run seed
npm run dev
Server runs on http://localhost:5000.

2. Client
Open another terminal:

cd client
npm install
npm run dev
Open the Vite URL shown in terminal (normally http://localhost:5173).

Environment
Edit server/.env:

MONGO_URI: MongoDB connection string
JWT_SECRET: strong secret
CLIENT_URL: http://localhost:5173
SMTP settings are optional for development. If omitted, the OTP is returned in the registration API response for local testing only.
Seeded admin
Email: admin@college.com
Password: Admin@12345
Change this password after first login.

Important workflow
New candidate registers and verifies OTP.
Account is created as pending/inactive.
Admin approves/activates the account and can assign the official email/password.
Student/teacher logs in using the active credentials.
Admin manages users. Teacher manages exams/questions/results. Student takes exams and sees published marks.
API
/api/auth authentication and OTP
/api/users admin user management
/api/exams teacher/student exam APIs
/api/questions teacher question APIs
/api/results teacher/student result APIs
