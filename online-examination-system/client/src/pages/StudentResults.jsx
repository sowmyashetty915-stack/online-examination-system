
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function StudentResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD STUDENT RESULTS
  // =========================================================
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/results/student"
      );

      console.log(
        "Student Results:",
        response.data
      );

      const resultData =
        response.data?.results ||
        response.data?.data ||
        response.data ||
        [];

      setResults(
        Array.isArray(resultData)
          ? resultData
          : []
      );

    } catch (err) {
      console.error(
        "Error loading results:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your results."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // CALCULATE PERCENTAGE
  // =========================================================
  const getPercentage = (
    score,
    totalMarks
  ) => {
    if (!totalMarks) {
      return 0;
    }

    return (
      (Number(score) /
        Number(totalMarks)) *
      100
    ).toFixed(2);
  };


  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="container py-4">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h2 className="fw-bold mb-2">
                📊 My Results
              </h2>

              <p className="text-muted mb-0">
                View your published examination results.
              </p>

            </div>

            <button
              className="btn btn-outline-primary"
              onClick={() =>
                navigate("/student")
              }
            >
              ← Student Dashboard
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading && (

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            >

              <span className="visually-hidden">
                Loading...
              </span>

            </div>

            <p className="mt-3 mb-0">
              Loading your results...
            </p>

          </div>

        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}
      {!loading && error && (

        <div className="alert alert-danger">

          <strong>
            Error:
          </strong>{" "}

          {error}

          <br />

          <button
            className="btn btn-sm btn-outline-danger mt-3"
            onClick={fetchResults}
          >
            🔄 Try Again
          </button>

        </div>

      )}


      {/* =====================================================
          NO RESULTS
      ===================================================== */}
      {!loading &&
        !error &&
        results.length === 0 && (

          <div className="card shadow-sm">

            <div className="card-body text-center py-5">

              <div
                style={{
                  fontSize: "60px",
                }}
              >
                📚
              </div>

              <h4 className="fw-bold mt-3">
                No Results Available
              </h4>

              <p className="text-muted">
                You don't have any published
                exam results yet.
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/student")
                }
              >
                Go to Available Exams
              </button>

            </div>

          </div>

      )}


      {/* =====================================================
          RESULTS
      ===================================================== */}
      {!loading &&
        !error &&
        results.length > 0 && (

          <div className="row">

            {results.map((result) => {

              const exam = result.exam || {};

              const score =
                Number(result.score) || 0;

              const totalMarks =
                Number(exam.totalMarks) || 0;

              const percentage =
                getPercentage(
                  score,
                  totalMarks
                );

              return (

                <div
                  className="col-md-6 col-lg-4 mb-4"
                  key={result._id}
                >

                  <div className="card h-100 shadow-sm">

                    {/* Card Header */}
                    <div className="card-header bg-success text-white">

                      <h5 className="mb-0">
                        📊 Result
                      </h5>

                    </div>


                    {/* Card Body */}
                    <div className="card-body">

                      <h4 className="fw-bold">
                        {exam.title ||
                          "Exam"}
                      </h4>

                      <p className="mb-2">

                        <strong>
                          Subject:
                        </strong>{" "}

                        {exam.subject ||
                          "Not specified"}

                      </p>


                      {/* Exam Date */}
                      {exam.examDate && (

                        <p className="mb-2">

                          <strong>
                            Exam Date:
                          </strong>{" "}

                          {new Date(
                            exam.examDate
                          ).toLocaleDateString()}

                        </p>

                      )}


                      <hr />


                      {/* Marks */}
                      <div className="text-center mb-3">

                        <h2 className="fw-bold text-success">

                          {score}

                          <span className="text-muted fs-5">
                            {" "} / {totalMarks}
                          </span>

                        </h2>

                        <p className="text-muted mb-0">
                          Marks Obtained
                        </p>

                      </div>


                      {/* Percentage */}
                      <div className="text-center mb-3">

                        <h4 className="fw-bold">

                          {percentage}%

                        </h4>

                        <p className="text-muted mb-0">
                          Percentage
                        </p>

                      </div>


                      {/* Status */}
                      <div className="text-center">

                        <span className="badge bg-success fs-6">
                          Published
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

      )}

    </div>
  );
}