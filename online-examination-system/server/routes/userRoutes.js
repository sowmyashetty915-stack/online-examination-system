
import { Router } from "express";

import {
  protect,
  allow,
} from "../middleware/authMiddleware.js";

import {
  listUsers,
  createAssignedUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| ADMIN PROTECTION
|--------------------------------------------------------------------------
| Every route below requires:
| 1. Valid JWT token
| 2. Admin role
|--------------------------------------------------------------------------
*/
router.use(
  protect,
  allow("admin")
);


/*
|--------------------------------------------------------------------------
| GET ALL STUDENTS & TEACHERS
|--------------------------------------------------------------------------
| GET /api/users
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  listUsers
);


/*
|--------------------------------------------------------------------------
| CREATE / ASSIGN USER
|--------------------------------------------------------------------------
| POST /api/users
|
| Admin can create:
| - Student
| - Teacher
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  createAssignedUser
);


/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
| PATCH /api/users/:id
|
| Admin can:
| - Change name
| - Change email
| - Change password
| - Activate/deactivate account
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  updateUser
);


/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
| DELETE /api/users/:id
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  deleteUser
);


export default router;