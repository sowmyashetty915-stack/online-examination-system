
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";

/*
|--------------------------------------------------------------------------
| CREATE EXAM
|--------------------------------------------------------------------------
| Teacher creates a new exam.
*/
export async function createExam(req, res) {
  try {
    const {
      title,
      subject,
      details,
      examDate,
      durationMinutes,
      totalMarks,
      published,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !subject ||
      !examDate ||
      !durationMinutes ||
      !totalMarks
    ) {
      return res.status(400).json({
        message:
          "Title, subject, exam date, duration and total marks are required",
      });
    }

    // Validate duration
    if (Number(durationMinutes) <= 0) {
      return res.status(400).json({
        message: "Exam duration must be greater than 0 minutes",
      });
    }

    // Validate date
    const date = new Date(examDate);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Invalid exam date",
      });
    }

    // Check teacher authentication
    if (!req.user) {
      return res.status(401).json({
        message: "Teacher authentication required",
      });
    }

    const teacherId = req.user._id || req.user.id;

    if (!teacherId) {
      return res.status(401).json({
        message: "Teacher ID not found",
      });
    }

    // Create exam
    const exam = await Exam.create({
      title: title.trim(),
      subject: subject.trim(),
      details: details?.trim() || "",
      examDate: date,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      published: Boolean(published),
      teacher: teacherId,
    });

    return res.status(201).json({
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error("CREATE EXAM ERROR:", error);

    return res.status(500).json({
      message: "Failed to create exam",
    });
  }
}


/*
|--------------------------------------------------------------------------
| PUBLISH EXAM
|--------------------------------------------------------------------------
*/
export async function publishExam(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const teacherId = req.user._id || req.user.id;

    const exam = await Exam.findOne({
      _id: req.params.id,
      teacher: teacherId,
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    if (exam.published) {
      return res.status(400).json({
        message: "Exam is already published",
      });
    }

    // Make sure exam has questions
    const questionCount = await Question.countDocuments({
      exam: exam._id,
    });

    if (questionCount === 0) {
      return res.status(400).json({
        message:
          "Add at least one question before publishing the exam",
      });
    }

    exam.published = true;

    await exam.save();

    return res.json({
      message: "Exam published successfully",
      exam,
    });
  } catch (error) {
    console.error("PUBLISH EXAM ERROR:", error);

    return res.status(500).json({
      message: "Failed to publish exam",
    });
  }
}


/*
|--------------------------------------------------------------------------
| LIST TEACHER EXAMS
|--------------------------------------------------------------------------
| GET /api/exams/teacher
|--------------------------------------------------------------------------
*/
export async function listTeacherExams(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const teacherId = req.user._id || req.user.id;

    if (!teacherId) {
      return res.status(401).json({
        message: "Teacher ID not found",
      });
    }

    const exams = await Exam.find({
      teacher: teacherId,
    }).sort({
      examDate: -1,
    });

    return res.json(exams);
  } catch (error) {
    console.error("LIST TEACHER EXAMS ERROR:", error);

    return res.status(500).json({
      message: "Failed to load teacher exams",
    });
  }
}


/*
|--------------------------------------------------------------------------
| LIST STUDENT EXAMS
|--------------------------------------------------------------------------
| GET /api/exams/student
|--------------------------------------------------------------------------
| Students can see published exams.
|--------------------------------------------------------------------------
*/
export async function listStudentExams(req, res) {
  try {
    console.log("=================================");
    console.log("STUDENT EXAMS REQUEST");
    console.log("USER:", req.user);
    console.log("=================================");

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        message: "Student authentication required",
      });
    }

    const studentId = req.user._id || req.user.id;

    if (!studentId) {
      console.error("Student ID missing from req.user");

      return res.status(401).json({
        message: "Student ID not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | GET PUBLISHED EXAMS
    |--------------------------------------------------------------------------
    */
    const exams = await Exam.find({
      published: true,
    })
      .sort({
        examDate: 1,
      })
      .lean();

    /*
    |--------------------------------------------------------------------------
    | GET STUDENT RESULTS
    |--------------------------------------------------------------------------
    */
    let results = [];

    try {
      results = await Result.find({
        student: studentId,
      })
        .select("exam status score")
        .lean();
    } catch (resultError) {
      /*
      |---------------------------------------------------------------
      | If Result query fails, don't prevent the student from
      | seeing available exams.
      |---------------------------------------------------------------
      */
      console.error(
        "RESULT QUERY ERROR:",
        resultError
      );

      results = [];
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE RESULT MAP
    |--------------------------------------------------------------------------
    */
    const resultMap = new Map();

    results.forEach((result) => {
      if (result.exam) {
        resultMap.set(
          String(result.exam),
          result
        );
      }
    });

    /*
    |--------------------------------------------------------------------------
    | FORMAT EXAMS
    |--------------------------------------------------------------------------
    */
    const now = new Date();

    const formattedExams = exams.map((exam) => {
      const startTime = new Date(
        exam.examDate
      );

      const endTime = new Date(
        startTime.getTime() +
          Number(exam.durationMinutes || 0) *
            60 *
            1000
      );

      const attempt =
        resultMap.get(
          String(exam._id)
        ) || null;

      const isOpen =
        now >= startTime &&
        now <= endTime;

      const hasAttempted =
        attempt !== null;

      const canAttend =
        isOpen &&
        !hasAttempted;

      return {
        ...exam,

        attempt,

        startTime,

        endTime,

        isOpen,

        hasAttempted,

        canAttend,
      };
    });

    console.log(
      "STUDENT EXAMS FOUND:",
      formattedExams.length
    );

    return res.json(formattedExams);
  } catch (error) {
    console.error(
      "LIST STUDENT EXAMS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load available exams",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
}


/*
|--------------------------------------------------------------------------
| GET SINGLE EXAM
|--------------------------------------------------------------------------
| GET /api/exams/:id
|--------------------------------------------------------------------------
*/
export async function getExam(req, res) {
  try {
    const exam = await Exam.findById(
      req.params.id
    );

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    return res.json(exam);
  } catch (error) {
    console.error(
      "GET EXAM ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load exam",
    });
  }
}


/*
|--------------------------------------------------------------------------
| DELETE EXAM
|--------------------------------------------------------------------------
| DELETE /api/exams/:id
|--------------------------------------------------------------------------
*/
export async function deleteExam(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const teacherId =
      req.user._id || req.user.id;

    const exam =
      await Exam.findOneAndDelete({
        _id: req.params.id,
        teacher: teacherId,
      });

    if (!exam) {
      return res.status(404).json({
        message:
          "Exam not found or you are not authorized to delete it",
      });
    }

    // Delete questions
    await Question.deleteMany({
      exam: exam._id,
    });

    // Delete results
    await Result.deleteMany({
      exam: exam._id,
    });

    return res.json({
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE EXAM ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete exam",
    });
  }
}