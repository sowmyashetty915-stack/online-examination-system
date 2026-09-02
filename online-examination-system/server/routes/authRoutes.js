
import { Router } from "express";

import {
  requestOtp,
  register,
  login,
} from "../controllers/authController.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| REQUEST OTP
|--------------------------------------------------------------------------
| POST /api/auth/request-otp
*/
router.post(
  "/request-otp",
  requestOtp
);


/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
| POST /api/auth/register
*/
router.post(
  "/register",
  register
);


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
| POST /api/auth/login
*/
router.post(
  "/login",
  login
);


export default router;