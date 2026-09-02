
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD STUDENT EXAMS
  // =========================================================
  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/exams/student"
      );

      console.log(
        "Student Exams Response:",
        response.data
      );

      const examData =
        response.data?.exams ||
        response.data?.data ||
        response.data ||
        [];

      setExams(
        Array.isArray(examData)
          ? examData
          : []
      );

    } catch (err) {
      console.error(
        "Error loading exams:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load available exams."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // TAKE EXAM
  // =========================================================
  const handleTakeExam = (examId) => {

    if (!examId) {
      alert("Exam ID is missing.");
      return;
    }

    console.log(
      "Opening exam:",
      examId
    );

    navigate(
      `/student/exam/${examId}`
    );
  };


  // =========================================================
  // VIEW RESULTS
  // =========================================================
  const handleViewResults = () => {
    navigate("/student/results");
  };


  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="container py-4">

      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}
      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h2 className="fw-bold mb-2">
            🎓 Student Dashboard
          </h2>

          <p className="text-muted mb-0">
            Welcome to your online examination dashboard.
          </p>

        </div>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}
      <div className="row mb-4">

        {/* Available Exams */}
        <div className="col-md-6 mb-3">

          <div className="card shadow-sm h-100">

            <div className="card-body text-center">

              <div
                style={{
                  fontSize: "45px",
                }}
              >
                📝
              </div>

              <h4 className="fw-bold mt-2">
                Available Exams
              </h4>

              <p className="text-muted">
                View and attend your available
                examinations.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => {
                  document
                    .getElementById(
                      "available-exams"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                View Exams
              </button>

            </div>

          </div>

        </div>


        {/* My Results */}
        <div className="col-md-6 mb-3">

          <div className="card shadow-sm h-100">

            <div className="card-body text-center">

              <div
                style={{
                  fontSize: "45px",
                }}
              >
                📊
              </div>

              <h4 className="fw-bold mt-2">
                My Results
              </h4>

              <p className="text-muted">
                Check your published exam marks
                and results.
              </p>

              <button
                className="btn btn-success"
                onClick={handleViewResults}
              >
                📊 View My Results
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          AVAILABLE EXAMS
      ===================================================== */}
      <div
        id="available-exams"
        className="card shadow-sm"
      >

        <div className="card-header bg-primary text-white">

          <h4 className="mb-0">
            📝 Available Exams
          </h4>

        </div>


        <div className="card-body">

          {/* Loading */}
          {loading && (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              >

                <span className="visually-hidden">
                  Loading...
                </span>

              </div>

              <p className="mt-3 mb-0">
                Loading available exams...
              </p>

            </div>

          )}


          {/* Error */}
          {!loading && error && (

            <div className="alert alert-danger">

              <strong>
                Error:
              </strong>{" "}

              {error}

              <br />

              <button
                className="btn btn-sm btn-outline-danger mt-3"
                onClick={fetchExams}
              >
                🔄 Try Again
              </button>

            </div>

          )}


          {/* No Exams */}
          {!loading &&
            !error &&
            exams.length === 0 && (

              <div className="alert alert-info text-center">

                <h5>
                  📚 No Exams Available
                </h5>

                <p className="mb-0">
                  There are currently no published
                  exams available for you.
                </p>

              </div>

          )}


          {/* Exam Cards */}
          {!loading &&
            !error &&
            exams.length > 0 && (

              <div className="row">

                {exams.map((exam) => (

                  <div
                    className="col-md-6 col-lg-4 mb-4"
                    key={exam._id}
                  >

                    <div className="card h-100 shadow-sm">

                      <div className="card-body d-flex flex-column">

                        {/* Title */}
                        <h5 className="card-title fw-bold">
                          {exam.title}
                        </h5>


                        {/* Subject */}
                        <p className="mb-2">

                          <strong>
                            Subject:
                          </strong>{" "}

                          {exam.subject ||
                            "Not specified"}

                        </p>


                        {/* Details */}
                        {exam.details && (

                          <p className="text-muted small">
                            {exam.details}
                          </p>

                        )}


                        {/* Exam Date */}
                        {exam.examDate && (

                          <p className="mb-2">

                            <strong>
                              Exam Date:
                            </strong>{" "}

                            {new Date(
                              exam.examDate
                            ).toLocaleString()}

                          </p>

                        )}


                        {/* Duration */}
                        {exam.durationMinutes && (

                          <p className="mb-3">

                            <strong>
                              Duration:
                            </strong>{" "}

                            {exam.durationMinutes}
                            {" "}minutes

                          </p>

                        )}


                        {/* Take Exam */}
                        <button
                          type="button"
                          className="btn btn-primary w-100 mt-auto"
                          onClick={() =>
                            handleTakeExam(
                              exam._id
                            )
                          }
                        >
                          📝 Take Exam
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

          )}

        </div>

      </div>

    </div>
  );
}