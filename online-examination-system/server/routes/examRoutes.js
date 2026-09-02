
import { Router } from "express";

import {
  protect,
  allow,
} from "../middleware/authMiddleware.js";

import {
  createExam,
  listTeacherExams,
  listStudentExams,
  getExam,
  deleteExam,
  publishExam,
} from "../controllers/examController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| ALL EXAM ROUTES REQUIRE LOGIN
|--------------------------------------------------------------------------
*/
router.use(protect);


/*
|--------------------------------------------------------------------------
| STUDENT
|--------------------------------------------------------------------------
| GET /api/exams/student
|
| Students can see published exams.
|--------------------------------------------------------------------------
*/
router.get(
  "/student",
  allow("student"),
  listStudentExams
);


/*
|--------------------------------------------------------------------------
| TEACHER
|--------------------------------------------------------------------------
| GET /api/exams/teacher
|
| Teacher can see exams created by themselves.
|--------------------------------------------------------------------------
*/
router.get(
  "/teacher",
  allow("teacher"),
  listTeacherExams
);


/*
|--------------------------------------------------------------------------
| CREATE EXAM
|--------------------------------------------------------------------------
| POST /api/exams
|
| Only teachers can create exams.
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  allow("teacher"),
  createExam
);


/*
|--------------------------------------------------------------------------
| PUBLISH EXAM
|--------------------------------------------------------------------------
| PATCH /api/exams/:id/publish
|
| Only teachers can publish their exams.
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/publish",
  allow("teacher"),
  publishExam
);


/*
|--------------------------------------------------------------------------
| GET SINGLE EXAM
|--------------------------------------------------------------------------
| GET /api/exams/:id
|
| Students and teachers can view an exam.
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  allow("teacher", "student"),
  getExam
);


/*
|--------------------------------------------------------------------------
| DELETE EXAM
|--------------------------------------------------------------------------
| DELETE /api/exams/:id
|
| Only teachers can delete exams.
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  allow("teacher"),
  deleteExam
);


export default router;