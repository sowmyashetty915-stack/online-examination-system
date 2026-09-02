
import Question from "../models/Question.js";
import Exam from "../models/Exam.js";


/*
|--------------------------------------------------------------------------
| LIST QUESTIONS - TEACHER
|--------------------------------------------------------------------------
| Returns all questions belonging to an exam created by the logged-in
| teacher.
*/
export async function listQuestions(req, res) {
  try {
    const exam = await Exam.findOne({
      _id: req.params.examId,
      teacher: req.user._id,
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    const questions = await Question.find({
      exam: exam._id,
    }).sort({
      createdAt: 1,
    });

    return res.json(questions);
  } catch (error) {
    console.error(
      "List questions error:",
      error
    );

    return res.status(500).json({
      message: "Failed to load questions",
    });
  }
}


/*
|--------------------------------------------------------------------------
| CREATE QUESTION - TEACHER
|--------------------------------------------------------------------------
*/
export async function createQuestion(req, res) {
  try {
    const exam = await Exam.findOne({
      _id: req.params.examId,
      teacher: req.user._id,
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    const {
      text,
      options,
      correctAnswer,
    } = req.body;

    // Validate question
    if (!text || !text.trim()) {
      return res.status(400).json({
        message:
          "Question text is required",
      });
    }

    // Validate options
    if (
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        message:
          "At least 2 options are required",
      });
    }

    // Check empty options
    if (
      options.some(
        (option) =>
          !String(option).trim()
      )
    ) {
      return res.status(400).json({
        message:
          "Options cannot be empty",
      });
    }

    // Validate correct answer
    const answer =
      Number(correctAnswer);

    if (
      !Number.isInteger(answer) ||
      answer < 0 ||
      answer >= options.length
    ) {
      return res.status(400).json({
        message:
          "Invalid correct answer",
      });
    }

    const question =
      await Question.create({
        exam: exam._id,
        text: text.trim(),
        options,
        correctAnswer: answer,
      });

    return res.status(201).json(
      question
    );
  } catch (error) {
    console.error(
      "Create question error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create question",
    });
  }
}


/*
|--------------------------------------------------------------------------
| UPDATE QUESTION - TEACHER
|--------------------------------------------------------------------------
*/
export async function updateQuestion(
  req,
  res
) {
  try {
    const question =
      await Question.findById(
        req.params.id
      ).populate("exam");

    if (
      !question ||
      !question.exam ||
      String(question.exam.teacher) !==
        String(req.user._id)
    ) {
      return res.status(404).json({
        message:
          "Question not found",
      });
    }

    const {
      text,
      options,
      correctAnswer,
    } = req.body;

    if (text !== undefined) {
      if (!String(text).trim()) {
        return res.status(400).json({
          message:
            "Question text cannot be empty",
        });
      }

      question.text =
        String(text).trim();
    }

    if (options !== undefined) {
      if (
        !Array.isArray(options) ||
        options.length < 2
      ) {
        return res.status(400).json({
          message:
            "At least 2 options are required",
        });
      }

      if (
        options.some(
          (option) =>
            !String(option).trim()
        )
      ) {
        return res.status(400).json({
          message:
            "Options cannot be empty",
        });
      }

      question.options = options;
    }

    if (
      correctAnswer !== undefined
    ) {
      const answer =
        Number(correctAnswer);

      const optionCount =
        options !== undefined
          ? options.length
          : question.options.length;

      if (
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer >= optionCount
      ) {
        return res.status(400).json({
          message:
            "Invalid correct answer",
        });
      }

      question.correctAnswer =
        answer;
    }

    await question.save();

    return res.json(question);
  } catch (error) {
    console.error(
      "Update question error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update question",
    });
  }
}


/*
|--------------------------------------------------------------------------
| DELETE QUESTION - TEACHER
|--------------------------------------------------------------------------
*/
export async function deleteQuestion(
  req,
  res
) {
  try {
    const question =
      await Question.findById(
        req.params.id
      ).populate("exam");

    if (
      !question ||
      !question.exam ||
      String(question.exam.teacher) !==
        String(req.user._id)
    ) {
      return res.status(404).json({
        message:
          "Question not found",
      });
    }

    await question.deleteOne();

    return res.json({
      message:
        "Question deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete question error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete question",
    });
  }
}


/*
|--------------------------------------------------------------------------
| STUDENT QUESTIONS
|--------------------------------------------------------------------------
| Students receive only questions and options.
| correctAnswer is NEVER sent to the frontend.
*/
export async function studentQuestions(
  req,
  res
) {
  try {
    const exam =
      await Exam.findById(
        req.params.examId
      );

    if (!exam) {
      return res.status(404).json({
        message:
          "Exam not found",
      });
    }

    if (!exam.published) {
      return res.status(404).json({
        message:
          "Exam is not published",
      });
    }

    const now = Date.now();

    const start =
      new Date(
        exam.examDate
      ).getTime();

    const end =
      start +
      Number(
        exam.durationMinutes
      ) *
        60 *
        1000;

    if (now < start) {
      return res.status(403).json({
        message:
          "Exam has not started yet",
      });
    }

    if (now > end) {
      return res.status(403).json({
        message:
          "Exam time has ended",
      });
    }

    const questions =
      await Question.find({
        exam: exam._id,
      })
        .select(
          "-correctAnswer"
        )
        .sort({
          createdAt: 1,
        });

    return res.json(questions);
  } catch (error) {
    console.error(
      "Student questions error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load exam questions",
    });
  }
}