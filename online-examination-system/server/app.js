
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

dotenv.config();

const app = express();


/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);


/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
*/
app.use(express.json());


/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/
app.get(
  "/api/health",
  (req, res) => {
    res.json({
      ok: true,
      message:
        "Online Examination API is running",
    });
  }
);


/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
| POST /api/auth/request-otp
| POST /api/auth/register
| POST /api/auth/login
|--------------------------------------------------------------------------
*/
app.use(
  "/api/auth",
  authRoutes
);


/*
|--------------------------------------------------------------------------
| USER / ADMIN ROUTES
|--------------------------------------------------------------------------
| GET    /api/users
| POST   /api/users
| PATCH  /api/users/:id
| DELETE /api/users/:id
|--------------------------------------------------------------------------
*/
app.use(
  "/api/users",
  userRoutes
);


/*
|--------------------------------------------------------------------------
| EXAM ROUTES
|--------------------------------------------------------------------------
*/
app.use(
  "/api/exams",
  examRoutes
);


/*
|--------------------------------------------------------------------------
| QUESTION ROUTES
|--------------------------------------------------------------------------
*/
app.use(
  "/api/questions",
  questionRoutes
);


/*
|--------------------------------------------------------------------------
| RESULT ROUTES
|--------------------------------------------------------------------------
*/
app.use(
  "/api/results",
  resultRoutes
);


/*
|--------------------------------------------------------------------------
| 404 - ROUTE NOT FOUND
|--------------------------------------------------------------------------
*/
app.use(
  (req, res) => {
    res.status(404).json({
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);


/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/
app.use(
  (err, req, res, next) => {
    console.error(err);

    res.status(
      err.status || 500
    ).json({
      message:
        err.message ||
        "Server error",
    });
  }
);


export default app;