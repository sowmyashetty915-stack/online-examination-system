
import Result from "../models/Result.js";
import Question from "../models/Question.js";
import Exam from "../models/Exam.js";

/*
|--------------------------------------------------------------------------
| SUBMIT EXAM - STUDENT
|--------------------------------------------------------------------------
| POST /api/results/submit
|
| The backend calculates the score using the correct answers.
|--------------------------------------------------------------------------
*/
export async function submitExam(req, res) {
  try {
    const {
      examId,
      answers = [],
    } = req.body;

    // Validate exam ID
    if (!examId) {
      return res.status(400).json({
        message: "Exam ID is required",
      });
    }

    // Find exam
    const exam = await Exam.findById(examId);

    if (!exam || !exam.published) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // Check exam time
    const now = Date.now();

    const start = new Date(
      exam.examDate
    ).getTime();

    const end =
      start +
      Number(exam.durationMinutes) *
        60 *
        1000;

    // Allow 60 seconds grace period
    if (
      now < start ||
      now > end + 60000
    ) {
      return res.status(403).json({
        message:
          "Exam submission window closed",
      });
    }

    // Prevent multiple attempts
    const existing =
      await Result.findOne({
        exam: examId,
        student: req.user._id,
      });

    if (existing) {
      return res.status(409).json({
        message:
          "You have already submitted this exam",
      });
    }

    // Get exam questions
    const questions =
      await Question.find({
        exam: examId,
      });

    if (!questions.length) {
      return res.status(400).json({
        message:
          "This exam has no questions",
      });
    }

    // Convert submitted answers into Map
    const answerMap = new Map();

    if (Array.isArray(answers)) {
      for (const answer of answers) {
        if (
          !answer ||
          !answer.question
        ) {
          continue;
        }

        const selected = Number(
          answer.selected
        );

        answerMap.set(
          String(answer.question),
          Number.isInteger(selected)
            ? selected
            : -1
        );
      }
    }

    // Calculate score
    let score = 0;

    const savedAnswers =
      questions.map((question) => {
        const questionId =
          String(question._id);

        const selected =
          answerMap.has(questionId)
            ? answerMap.get(questionId)
            : -1;

        const validSelection =
          Number.isInteger(selected) &&
          selected >= 0 &&
          selected <
            question.options.length;

        const finalSelected =
          validSelection
            ? selected
            : -1;

        // Score calculated on server
        if (
          finalSelected !== -1 &&
          finalSelected ===
            Number(
              question.correctAnswer
            )
        ) {
          score +=
            Number(question.marks) || 1;
        }

        return {
          question: question._id,
          selected: finalSelected,
        };
      });

    // Create result
    const result =
      await Result.create({
        exam: examId,
        student: req.user._id,
        answers: savedAnswers,
        score,
        status: "submitted",
      });

    return res.status(201).json({
      message:
        "Exam submitted successfully. Result will be visible after teacher publishes it.",
      score: result.score,
      status: result.status,
    });

  } catch (error) {
    console.error(
      "Submit exam error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to submit exam",
    });
  }
}


/*
|--------------------------------------------------------------------------
| TEACHER - VIEW RESULTS
|--------------------------------------------------------------------------
| GET /api/results/teacher
|
| Teacher can see results for their own exams.
|--------------------------------------------------------------------------
*/
export async function teacherResults(
  req,
  res
) {
  try {
    const exams =
      await Exam.find({
        teacher: req.user._id,
      }).select(
        "_id title subject totalMarks"
      );

    const examIds =
      exams.map(
        (exam) => exam._id
      );

    const results =
      await Result.find({
        exam: {
          $in: examIds,
        },
      })
        .populate(
          "exam",
          "title subject totalMarks examDate"
        )
        .populate(
          "student",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.json(results);

  } catch (error) {
    console.error(
      "Teacher results error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load results",
    });
  }
}


/*
|--------------------------------------------------------------------------
| PUBLISH RESULT - TEACHER
|--------------------------------------------------------------------------
| PATCH /api/results/:id/publish
|
| Teacher can publish only results belonging to
| their own exams.
|--------------------------------------------------------------------------
*/
export async function publishResult(
  req,
  res
) {
  try {
    const result =
      await Result.findById(
        req.params.id
      ).populate("exam");

    if (
      !result ||
      !result.exam ||
      String(
        result.exam.teacher
      ) !== String(req.user._id)
    ) {
      return res.status(404).json({
        message:
          "Result not found",
      });
    }

    // Check if already published
    if (
      result.status === "published"
    ) {
      return res.status(400).json({
        message:
          "Result is already published",
      });
    }

    result.status = "published";
    result.publishedAt = new Date();

    await result.save();

    return res.json({
      message:
        "Result published successfully",
      result,
    });

  } catch (error) {
    console.error(
      "Publish result error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to publish result",
    });
  }
}


/*
|--------------------------------------------------------------------------
| STUDENT - VIEW RESULTS
|--------------------------------------------------------------------------
| GET /api/results/student
|
| Student can see only their own published results.
|--------------------------------------------------------------------------
*/
export async function studentResults(
  req,
  res
) {
  try {
    const results =
      await Result.find({
        student: req.user._id,
        status: "published",
      })
        .populate(
          "exam",
          "title subject totalMarks examDate durationMinutes"
        )
        .sort({
          createdAt: -1,
        });

    return res.json(results);

  } catch (error) {
    console.error(
      "Student results error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load student results",
    });
  }
}