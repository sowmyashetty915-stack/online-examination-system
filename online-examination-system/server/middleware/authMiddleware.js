
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/*
|--------------------------------------------------------------------------
| PROTECT
|--------------------------------------------------------------------------
| Checks whether the user has a valid JWT token.
| If valid, the user is attached to req.user.
*/
export async function protect(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization || "";

    // Check Bearer token
    if (
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        message:
          "Authentication required. Please login.",
      });
    }

    // Extract token
    const token =
      authorization.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        message:
          "Authentication token is missing",
      });
    }

    // Verify token
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Check token payload
    if (!decoded?.id) {
      return res.status(401).json({
        message:
          "Invalid authentication token",
      });
    }

    // Find user
    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {
      return res.status(401).json({
        message:
          "User account not found",
      });
    }

    // Check active status
    if (!user.active) {
      return res.status(403).json({
        message:
          "Account is pending admin approval or inactive",
      });
    }

    // Attach authenticated user
    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        message:
          "Your session has expired. Please login again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message:
          "Invalid authentication token. Please login again.",
      });
    }

    return res.status(401).json({
      message:
        "Authentication failed",
    });
  }
}


/*
|--------------------------------------------------------------------------
| ALLOW
|--------------------------------------------------------------------------
| Restricts a route to specific user roles.
|
| Example:
| allow("admin")
| allow("teacher")
| allow("student")
| allow("admin", "teacher")
*/
export function allow(...roles) {
  return (
    req,
    res,
    next
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    if (
      !roles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message:
          "Access denied. You do not have permission to access this resource.",
      });
    }

    next();
  };
}