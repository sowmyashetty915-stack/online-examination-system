
import { Router } from "express";

import {
  protect,
  allow,
} from "../middleware/authMiddleware.js";

import {
  submitExam,
  teacherResults,
  publishResult,
  studentResults,
} from "../controllers/resultController.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| ALL RESULT ROUTES REQUIRE LOGIN
|--------------------------------------------------------------------------
*/
router.use(protect);


/*
|--------------------------------------------------------------------------
| STUDENT - SUBMIT EXAM
|--------------------------------------------------------------------------
| POST /api/results/submit
|
| Student submits answers.
| Backend calculates the score.
|--------------------------------------------------------------------------
*/
router.post(
  "/submit",
  allow("student"),
  submitExam
);


/*
|--------------------------------------------------------------------------
| TEACHER - VIEW RESULTS
|--------------------------------------------------------------------------
| GET /api/results/teacher
|
| Teacher sees results for their own exams.
|--------------------------------------------------------------------------
*/
router.get(
  "/teacher",
  allow("teacher"),
  teacherResults
);


/*
|--------------------------------------------------------------------------
| TEACHER - PUBLISH RESULT
|--------------------------------------------------------------------------
| PATCH /api/results/:id/publish
|
| Result becomes visible to the student.
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/publish",
  allow("teacher"),
  publishResult
);


/*
|--------------------------------------------------------------------------
| STUDENT - VIEW PUBLISHED RESULTS
|--------------------------------------------------------------------------
| GET /api/results/student
|--------------------------------------------------------------------------
*/
router.get(
  "/student",
  allow("student"),
  studentResults
);


export default router;
