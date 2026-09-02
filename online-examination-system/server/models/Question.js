
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam is required"],
    },

    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },

    options: {
      type: [String],

      required: [true, "Four options are required"],

      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length === 4 &&
            value.every(
              (option) =>
                typeof option === "string" &&
                option.trim().length > 0
            )
          );
        },

        message:
          "Each question must have exactly 4 non-empty options",
      },
    },

    correctAnswer: {
      type: Number,
      required: [true, "Correct answer is required"],
      min: [0, "Correct answer must be between 0 and 3"],
      max: [3, "Correct answer must be between 0 and 3"],
    },

    marks: {
      type: Number,
      default: 1,
      min: [1, "Marks must be at least 1"],
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Question",
  questionSchema
);