
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Otp from "../models/Otp.js";

import {
  makeOtp,
  hashOtp,
  sendOtp,
} from "../utils/otp.js";

import {
  signToken,
  publicUser,
} from "../utils/auth.js";

/*
|--------------------------------------------------------------------------
| REQUEST OTP
|--------------------------------------------------------------------------
| Sends / generates a 6-digit OTP for the candidate's email.
*/
export async function requestOtp(req, res) {
  try {
    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check whether email is already registered
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Generate OTP
    const otp = makeOtp();

    // OTP expires after 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Save hashed OTP
    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        otpHash: hashOtp(otp),
        expiresAt,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Try sending OTP
    const sent = await sendOtp(
      normalizedEmail,
      otp
    );

    /*
     * Development mode:
     * If email sending is not configured,
     * show OTP so the project can be tested locally.
     *
     * In production, do NOT return the OTP.
     */
    return res.status(200).json({
      message: sent
        ? "OTP sent successfully. Check your email."
        : "OTP generated successfully.",
      devOtp: sent ? undefined : otp,
    });
  } catch (error) {
    console.error("Request OTP error:", error);

    return res.status(500).json({
      message: "Server error while generating OTP",
    });
  }
}


/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
| Creates a Student or Teacher account after OTP verification.
|
| Admin cannot register through the public registration page.
| New Student/Teacher accounts remain inactive until Admin approves them.
*/
export async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role,
      otp,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !otp
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const normalizedRole =
      role.toLowerCase().trim();

    // Only Student and Teacher registration allowed
    if (
      !["student", "teacher"].includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        message:
          "Only Student and Teacher registration is allowed",
      });
    }

    // Password validation
    //
    // Requirements:
    // At least 8 characters
    // At least one lowercase
    // At least one uppercase
    // At least one number
    // At least one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with uppercase, lowercase, number and special character",
      });
    }

    // Check existing account
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Find OTP record
    const otpRecord =
      await Otp.findOne({
        email: normalizedEmail,
      });

    if (!otpRecord) {
      return res.status(400).json({
        message:
          "Please request an OTP first",
      });
    }

    // Check OTP expiry
    if (
      !otpRecord.expiresAt ||
      otpRecord.expiresAt < new Date()
    ) {
      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP",
      });
    }

    // Check OTP
    const enteredOtp = String(otp).trim();

    if (
      otpRecord.otpHash !==
      hashOtp(enteredOtp)
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      // Only student / teacher allowed
      role: normalizedRole,

      // Admin must approve account
      active: false,

      // OTP has already verified email
      emailVerified: true,
    });

    // Delete used OTP
    await Otp.deleteMany({
      email: normalizedEmail,
    });

    return res.status(201).json({
      message:
        "Registration successful. Wait for admin approval.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    // Handle duplicate email race condition
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      message:
        "Server error during registration",
    });
  }
}


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
| Used by Admin, Student and Teacher.
*/
export async function login(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Invalid credentials
    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // Check email verification
    if (!user.emailVerified) {
      return res.status(403).json({
        message:
          "Please verify your email first",
      });
    }

    // Check account activation
    if (!user.active) {
      return res.status(403).json({
        message:
          "Account is pending admin approval or inactive",
      });
    }

    // Generate JWT token
    const token = signToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during login",
    });
  }
}