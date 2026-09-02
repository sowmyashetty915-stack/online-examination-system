
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { publicUser } from "../utils/auth.js";


/*
|--------------------------------------------------------------------------
| LIST USERS
|--------------------------------------------------------------------------
| Admin can see only student and teacher accounts.
*/
export async function listUsers(req, res) {
  try {
    const users = await User.find({
      role: {
        $in: ["student", "teacher"],
      },
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.json(users);
  } catch (error) {
    console.error(
      "List users error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load users",
    });
  }
}


/*
|--------------------------------------------------------------------------
| CREATE ASSIGNED USER
|--------------------------------------------------------------------------
| Admin creates an official student or teacher account.
*/
export async function createAssignedUser(
  req,
  res
) {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message:
          "Name, email, password and role are required",
      });
    }

    // Admin can create only student/teacher accounts
    if (
      !["student", "teacher"].includes(
        role
      )
    ) {
      return res.status(400).json({
        message:
          "Only student or teacher accounts can be created",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (
      !passwordRegex.test(password)
    ) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters with uppercase, lowercase, number and special character",
      });
    }

    // Check duplicate email
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "Email already exists",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    // Create account
    const user =
      await User.create({
        name: name.trim(),

        email: normalizedEmail,

        password: hashedPassword,

        role,

        active: true,

        emailVerified: true,

        createdBy: req.user._id,
      });

    return res.status(201).json(
      publicUser(user)
    );
  } catch (error) {
    console.error(
      "Create assigned user error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create user",
    });
  }
}


/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
| Admin can update student/teacher accounts.
*/
export async function updateUser(
  req,
  res
) {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    // Prevent modifying admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        message:
          "Admin accounts cannot be modified here",
      });
    }

    const {
      name,
      email,
      password,
      active,
    } = req.body;

    // Update name
    if (
      name !== undefined
    ) {
      if (!String(name).trim()) {
        return res.status(400).json({
          message:
            "Name cannot be empty",
        });
      }

      user.name =
        String(name).trim();
    }

    // Update email
    if (
      email !== undefined
    ) {
      const normalizedEmail =
        email.trim().toLowerCase();

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          message:
            "Please enter a valid email address",
        });
      }

      // Check whether another user
      // already uses this email
      const existing =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (existing) {
        return res.status(409).json({
          message:
            "Email already exists",
        });
      }

      user.email =
        normalizedEmail;

      // Admin-controlled email is verified
      user.emailVerified = true;
    }

    // Update active status
    if (
      typeof active === "boolean"
    ) {
      user.active = active;
    }

    // Update password
    if (password !== undefined) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

      if (
        !passwordRegex.test(
          password
        )
      ) {
        return res.status(400).json({
          message:
            "Password must contain at least 8 characters with uppercase, lowercase, number and special character",
        });
      }

      user.password =
        await bcrypt.hash(
          password,
          12
        );
    }

    await user.save();

    return res.json(
      publicUser(user)
    );
  } catch (error) {
    console.error(
      "Update user error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update user",
    });
  }
}


/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
| Admin can delete student/teacher accounts.
*/
export async function deleteUser(
  req,
  res
) {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    // Never delete admin through this route
    if (user.role === "admin") {
      return res.status(403).json({
        message:
          "Admin accounts cannot be deleted here",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    return res.json({
      message:
        "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete user",
    });
  }
}
