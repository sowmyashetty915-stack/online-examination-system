
import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    details: {
      type: String,
      default: "",
      trim: true,
    },

    examDate: {
      type: Date,
      required: [true, "Exam date and time are required"],
    },

    durationMinutes: {
      type: Number,
      required: [true, "Exam duration is required"],
      min: [1, "Exam duration must be at least 1 minute"],
    },

    totalMarks: {
      type: Number,
      required: [true, "Total marks are required"],
      min: [1, "Total marks must be at least 1"],
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Exam",
  examSchema
);