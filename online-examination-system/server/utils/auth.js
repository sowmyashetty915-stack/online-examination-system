
import jwt from "jsonwebtoken";


/*
|--------------------------------------------------------------------------
| GENERATE JWT TOKEN
|--------------------------------------------------------------------------
*/
export function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured in .env"
    );
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );
}


/*
|--------------------------------------------------------------------------
| PUBLIC USER DATA
|--------------------------------------------------------------------------
| Never send the password to the frontend.
|--------------------------------------------------------------------------
*/
export function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    emailVerified: user.emailVerified,
  };
}