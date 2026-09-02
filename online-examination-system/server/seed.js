
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();


/*
|--------------------------------------------------------------------------
| CONNECT DATABASE
|--------------------------------------------------------------------------
*/
await connectDB();


/*
|--------------------------------------------------------------------------
| DEFAULT ADMIN CREDENTIALS
|--------------------------------------------------------------------------
*/
const email = "admin@college.com";
const password = "Admin@12345";


/*
|--------------------------------------------------------------------------
| CHECK WHETHER ADMIN ALREADY EXISTS
|--------------------------------------------------------------------------
*/
const exists = await User.findOne({
  email,
});


if (!exists) {

  /*
  |--------------------------------------------------------------------------
  | HASH PASSWORD
  |--------------------------------------------------------------------------
  */
  const hashedPassword =
    await bcrypt.hash(password, 12);


  /*
  |--------------------------------------------------------------------------
  | CREATE ADMIN
  |--------------------------------------------------------------------------
  */
  await User.create({
    name: "System Administrator",

    email,

    password: hashedPassword,

    role: "admin",

    active: true,

    emailVerified: true,

    createdBy: null,
  });


  console.log(
    "Admin seeded successfully!"
  );

  console.log(
    "Email:",
    email
  );

  console.log(
    "Password:",
    password
  );

} else {

  console.log(
    "Admin already exists."
  );
}


/*
|--------------------------------------------------------------------------
| CLOSE DATABASE CONNECTION
|--------------------------------------------------------------------------
*/
await mongoose.disconnect();

console.log(
  "Database connection closed."
);