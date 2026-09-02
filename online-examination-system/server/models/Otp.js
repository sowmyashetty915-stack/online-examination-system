
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
    },

    expiresAt: {
      type: Date,
      required: [true, "OTP expiry time is required"],
    },
  },
  {
    timestamps: true,
  }
);


/*
|--------------------------------------------------------------------------
| TTL INDEX
|--------------------------------------------------------------------------
| MongoDB automatically deletes OTP records when expiresAt is reached.
*/
otpSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);


export default mongoose.model(
  "Otp",
  otpSchema
);