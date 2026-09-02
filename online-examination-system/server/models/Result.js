
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | EXAM
    |--------------------------------------------------------------------------
    */
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | STUDENT
    |--------------------------------------------------------------------------
    */
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | ANSWERS
    |--------------------------------------------------------------------------
    */
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },

        selected: {
          type: Number,
          default: -1,
          min: -1,
          max: 3,
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | SCORE
    |--------------------------------------------------------------------------
    */
    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | RESULT STATUS
    |--------------------------------------------------------------------------
    */
    status: {
      type: String,
      enum: [
        "submitted",
        "published",
      ],
      default: "submitted",
    },

    /*
    |--------------------------------------------------------------------------
    | SUBMISSION TIME
    |--------------------------------------------------------------------------
    */
    submittedAt: {
      type: Date,
      default: Date.now,
    },

    /*
    |--------------------------------------------------------------------------
    | PUBLICATION TIME
    |--------------------------------------------------------------------------
    */
    publishedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);


/*
|--------------------------------------------------------------------------
| UNIQUE EXAM ATTEMPT
|--------------------------------------------------------------------------
| A student can submit an exam only once.
*/
resultSchema.index(
  {
    exam: 1,
    student: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.model(
  "Result",
  resultSchema
);