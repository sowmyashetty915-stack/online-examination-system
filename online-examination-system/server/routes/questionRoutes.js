
import { Router } from "express";

import {
  protect,
  allow,
} from "../middleware/authMiddleware.js";

import {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  studentQuestions,
} from "../controllers/questionController.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| ALL QUESTION ROUTES REQUIRE LOGIN
|--------------------------------------------------------------------------
*/
router.use(protect);


/*
|--------------------------------------------------------------------------
| STUDENT - GET EXAM QUESTIONS
|--------------------------------------------------------------------------
| GET /api/questions/student/:examId
|
| Students receive questions without correctAnswer.
|--------------------------------------------------------------------------
*/
router.get(
  "/student/:examId",
  allow("student"),
  studentQuestions
);


/*
|--------------------------------------------------------------------------
| TEACHER - LIST QUESTIONS
|--------------------------------------------------------------------------
| GET /api/questions/:examId
|--------------------------------------------------------------------------
*/
router.get(
  "/:examId",
  allow("teacher"),
  listQuestions
);


/*
|--------------------------------------------------------------------------
| TEACHER - CREATE QUESTION
|--------------------------------------------------------------------------
| POST /api/questions/:examId
|--------------------------------------------------------------------------
*/
router.post(
  "/:examId",
  allow("teacher"),
  createQuestion
);


/*
|--------------------------------------------------------------------------
| TEACHER - UPDATE QUESTION
|--------------------------------------------------------------------------
| PATCH /api/questions/:id
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  allow("teacher"),
  updateQuestion
);


/*
|--------------------------------------------------------------------------
| TEACHER - DELETE QUESTION
|--------------------------------------------------------------------------
| DELETE /api/questions/:id
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  allow("teacher"),
  deleteQuestion
);


export default router;