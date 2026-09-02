
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | NAME
    |--------------------------------------------------------------------------
    */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    /*
    |--------------------------------------------------------------------------
    | EMAIL
    |--------------------------------------------------------------------------
    */
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | PASSWORD
    |--------------------------------------------------------------------------
    | Password is stored as a bcrypt hash.
    |--------------------------------------------------------------------------
    */
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | ROLE
    |--------------------------------------------------------------------------
    */
    role: {
      type: String,
      enum: [
        "admin",
        "teacher",
        "student",
      ],
      required: [true, "Role is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | ACTIVE STATUS
    |--------------------------------------------------------------------------
    | Student/Teacher accounts remain inactive until approved by admin.
    |--------------------------------------------------------------------------
    */
    active: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | EMAIL VERIFICATION
    |--------------------------------------------------------------------------
    */
    emailVerified: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | CREATED BY
    |--------------------------------------------------------------------------
    | Stores the admin who created/assigned the account.
    |--------------------------------------------------------------------------
    */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);