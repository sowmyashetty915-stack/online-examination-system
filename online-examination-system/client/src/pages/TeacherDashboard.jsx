
import React, { useEffect, useState } from "react";
import api from "../api/api.js";

export default function TeacherDashboard() {
  const [tab, setTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    details: "",
    examDate: "",
    durationMinutes: 60,
    totalMarks: 100,
  });

  const [q, setQ] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    marks: 1,
  });

  const [error, setError] = useState("");

  // =========================================================
  // LOAD TEACHER EXAMS
  // =========================================================
  const load = async () => {
    try {
      setError("");

      const response = await api.get("/exams/teacher");

      setExams(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load exams"
      );
    }
  };

  // =========================================================
  // LOAD RESULTS
  // =========================================================
  const loadResults = async () => {
    try {
      setError("");

      const response = await api.get(
        "/results/teacher"
      );

      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load results"
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    load();
  }, []);

  // =========================================================
  // CREATE EXAM
  // =========================================================
  const createExam = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await api.post("/exams", {
        ...form,
        durationMinutes: Number(
          form.durationMinutes
        ),
        totalMarks: Number(form.totalMarks),
      });

      alert("Exam created successfully!");

      setForm({
        title: "",
        subject: "",
        details: "",
        examDate: "",
        durationMinutes: 60,
        totalMarks: 100,
      });

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create exam"
      );
    }
  };

  // =========================================================
  // SELECT EXAM / LOAD QUESTIONS
  // =========================================================
  const choose = async (id) => {
    try {
      setError("");
      setSelected(id);

      const response = await api.get(
        "/questions/" + id
      );

      setQuestions(response.data);

      setTab("questions");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load questions"
      );
    }
  };

  // =========================================================
  // ADD QUESTION
  // =========================================================
  const addQ = async (e) => {
    e.preventDefault();

    setError("");

    if (!selected) {
      setError("Please select an exam first.");
      return;
    }

    try {
      await api.post(
        "/questions/" + selected,
        {
          ...q,
          correctAnswer: Number(
            q.correctAnswer
          ),
          marks: Number(q.marks),
        }
      );

      alert("Question added successfully!");

      setQ({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        marks: 1,
      });

      const response = await api.get(
        "/questions/" + selected
      );

      setQuestions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add question"
      );
    }
  };

  // =========================================================
  // DELETE QUESTION
  // =========================================================
  const delQ = async (id) => {
    if (!window.confirm("Delete this question?")) {
      return;
    }

    try {
      setError("");

      await api.delete(
        "/questions/" + id
      );

      const response = await api.get(
        "/questions/" + selected
      );

      setQuestions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete question"
      );
    }
  };

  // =========================================================
  // PUBLISH EXAM
  // =========================================================
  const publishExam = async (id) => {
    try {
      setError("");

      const response = await api.patch(
        `/exams/${id}/publish`
      );

      alert(
        response.data?.message ||
          "Exam published successfully!"
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to publish exam"
      );
    }
  };

  // =========================================================
  // DELETE EXAM
  // =========================================================
  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam?")) {
      return;
    }

    try {
      setError("");

      await api.delete(
        "/exams/" + id
      );

      alert("Exam deleted successfully!");

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete exam"
      );
    }
  };

  // =========================================================
  // PUBLISH RESULT
  // =========================================================
  const publish = async (id) => {
    try {
      setError("");

      await api.patch(
        "/results/" + id + "/publish"
      );

      alert("Result published successfully!");

      await loadResults();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to publish result"
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="container py-4">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Teacher Dashboard</h2>

          <p className="small-muted">
            Create exams, manage questions and
            publish result reports.
          </p>
        </div>
      </div>


      {/* =====================================================
          TABS
      ====================================================== */}
      <ul className="nav nav-tabs mb-4">

        <li className="nav-item">
          <button
            className={
              "nav-link " +
              (tab === "exams"
                ? "active"
                : "")
            }
            onClick={() =>
              setTab("exams")
            }
          >
            Add / Manage Exams
          </button>
        </li>

        <li className="nav-item">
          <button
            className={
              "nav-link " +
              (tab === "questions"
                ? "active"
                : "")
            }
            onClick={() =>
              setTab("questions")
            }
          >
            Manage Questions
          </button>
        </li>

        <li className="nav-item">
          <button
            className={
              "nav-link " +
              (tab === "results"
                ? "active"
                : "")
            }
            onClick={() => {
              setTab("results");
              loadResults();
            }}
          >
            Result Report
          </button>
        </li>

      </ul>


      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      {/* =====================================================
          EXAMS TAB
      ====================================================== */}
      {tab === "exams" && (
        <div className="row g-4">

          {/* =================================================
              ADD EXAM
          ================================================= */}
          <div className="col-lg-5">

            <div className="card p-4">

              <h5 className="mb-3">
                Add Exam
              </h5>

              <form onSubmit={createExam}>

                <input
                  className="form-control mb-2"
                  required
                  placeholder="Exam title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title:
                        e.target.value,
                    })
                  }
                />

                <input
                  className="form-control mb-2"
                  required
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject:
                        e.target.value,
                    })
                  }
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Exam details"
                  value={form.details}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      details:
                        e.target.value,
                    })
                  }
                />

                <label className="form-label">
                  Exam date and time
                </label>

                <input
                  className="form-control mb-2"
                  type="datetime-local"
                  required
                  value={form.examDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      examDate:
                        e.target.value,
                    })
                  }
                />

                <label className="form-label">
                  Duration (minutes)
                </label>

                <input
                  className="form-control mb-2"
                  type="number"
                  min="1"
                  required
                  value={
                    form.durationMinutes
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      durationMinutes:
                        e.target.value,
                    })
                  }
                />

                <label className="form-label">
                  Total Marks
                </label>

                <input
                  className="form-control mb-3"
                  type="number"
                  min="1"
                  required
                  value={
                    form.totalMarks
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      totalMarks:
                        e.target.value,
                    })
                  }
                />

                <button
                  className="btn btn-primary w-100"
                >
                  Create Exam
                </button>

              </form>

            </div>

          </div>


          {/* =================================================
              MANAGE EXAMS
          ================================================= */}
          <div className="col-lg-7">

            <div className="card p-4 table-card">

              <h5 className="mb-3">
                Manage Exams
              </h5>

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Date</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Questions</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {exams.map((exam) => (

                      <tr key={exam._id}>

                        {/* Exam */}
                        <td>
                          <strong>
                            {exam.title}
                          </strong>

                          <br />

                          <small className="text-muted">
                            {exam.subject}
                          </small>
                        </td>


                        {/* Date */}
                        <td>
                          {new Date(
                            exam.examDate
                          ).toLocaleString()}
                        </td>


                        {/* Duration */}
                        <td>
                          {
                            exam.durationMinutes
                          }{" "}
                          min
                        </td>


                        {/* Status */}
                        <td>

                          {exam.published ? (
                            <span className="badge text-bg-success">
                              Published
                            </span>
                          ) : (
                            <span className="badge text-bg-warning">
                              Draft
                            </span>
                          )}

                        </td>


                        {/* Questions */}
                        <td>

                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              choose(
                                exam._id
                              )
                            }
                          >
                            Manage
                          </button>

                        </td>


                        {/* Actions */}
                        <td>

                          <div className="d-flex gap-1 flex-wrap">

                            {!exam.published && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  publishExam(
                                    exam._id
                                  )
                                }
                              >
                                Publish
                              </button>
                            )}

                            {exam.published && (
                              <span className="text-success small fw-bold">
                                ✓ Published
                              </span>
                            )}

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                deleteExam(
                                  exam._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>


              {exams.length === 0 && (
                <p className="small-muted">
                  No exams available.
                </p>
              )}

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          QUESTIONS TAB
      ====================================================== */}
      {tab === "questions" && (

        <div className="row g-4">

          {/* ADD QUESTION */}
          <div className="col-lg-5">

            <div className="card p-4">

              <h5>
                Add Question
              </h5>

              <select
                className="form-select mb-3"
                value={selected || ""}
                onChange={async (e) => {

                  const examId =
                    e.target.value;

                  setSelected(examId);

                  if (examId) {

                    try {

                      const response =
                        await api.get(
                          "/questions/" +
                            examId
                        );

                      setQuestions(
                        response.data
                      );

                    } catch (err) {

                      setError(
                        err.response?.data
                          ?.message ||
                          "Failed to load questions"
                      );

                    }

                  } else {

                    setQuestions([]);

                  }

                }}
              >

                <option value="">
                  Select exam
                </option>

                {exams.map((exam) => (

                  <option
                    key={exam._id}
                    value={exam._id}
                  >
                    {exam.title}
                  </option>

                ))}

              </select>


              {selected && (

                <form onSubmit={addQ}>

                  <textarea
                    className="form-control mb-2"
                    required
                    placeholder="Question"
                    value={q.text}
                    onChange={(e) =>
                      setQ({
                        ...q,
                        text:
                          e.target.value,
                      })
                    }
                  />


                  {q.options.map(
                    (option, index) => (

                      <input
                        key={index}
                        className="form-control mb-2"
                        required
                        placeholder={
                          `Option ${String.fromCharCode(
                            65 + index
                          )}`
                        }
                        value={option}
                        onChange={(e) => {

                          const updatedOptions =
                            [...q.options];

                          updatedOptions[
                            index
                          ] =
                            e.target.value;

                          setQ({
                            ...q,
                            options:
                              updatedOptions,
                          });

                        }}
                      />

                    )
                  )}


                  <label className="form-label">
                    Correct option
                  </label>

                  <select
                    className="form-select mb-2"
                    value={
                      q.correctAnswer
                    }
                    onChange={(e) =>
                      setQ({
                        ...q,
                        correctAnswer:
                          Number(
                            e.target.value
                          ),
                      })
                    }
                  >

                    <option value="0">
                      A
                    </option>

                    <option value="1">
                      B
                    </option>

                    <option value="2">
                      C
                    </option>

                    <option value="3">
                      D
                    </option>

                  </select>


                  <label className="form-label">
                    Marks
                  </label>

                  <input
                    className="form-control mb-3"
                    type="number"
                    min="1"
                    value={q.marks}
                    onChange={(e) =>
                      setQ({
                        ...q,
                        marks:
                          Number(
                            e.target.value
                          ),
                      })
                    }
                  />


                  <button className="btn btn-primary">
                    Add Question
                  </button>

                </form>

              )}

            </div>

          </div>


          {/* QUESTIONS LIST */}
          <div className="col-lg-7">

            <div className="card p-4">

              {selected ? (

                questions.length > 0 ? (

                  questions.map(
                    (question, index) => (

                      <div
                        className="border rounded p-3 mb-2"
                        key={question._id}
                      >

                        <strong>
                          Q{index + 1}.{" "}
                          {question.text}
                        </strong>


                        <ol
                          type="A"
                          className="mb-1"
                        >

                          {question.options.map(
                            (option, optionIndex) => (

                              <li key={optionIndex}>
                                {option}
                              </li>

                            )
                          )}

                        </ol>


                        <small>
                          Correct:{" "}
                          {String.fromCharCode(
                            65 +
                              question.correctAnswer
                          )}{" "}
                          •{" "}
                          {question.marks}{" "}
                          mark(s)
                        </small>


                        <button
                          className="btn btn-sm btn-outline-danger float-end"
                          onClick={() =>
                            delQ(
                              question._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    )
                  )

                ) : (

                  <p className="small-muted">
                    No questions added yet.
                  </p>

                )

              ) : (

                <p className="small-muted">
                  Select an exam to manage
                  its questions.
                </p>

              )}

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          RESULTS TAB
      ====================================================== */}
      {tab === "results" && (

        <div className="card p-4 table-card">

          <h5>
            Result Report
          </h5>

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>

                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {results.map(
                  (result) => (

                    <tr key={result._id}>

                      <td>
                        {result.student?.name}

                        <br />

                        <small>
                          {result.student?.email}
                        </small>
                      </td>


                      <td>
                        {result.exam?.title}
                      </td>


                      <td>
                        {result.score}/
                        {
                          result.exam
                            ?.totalMarks
                        }
                      </td>


                      <td>

                        {result.status ===
                        "published" ? (

                          <span className="badge text-bg-success">
                            Published
                          </span>

                        ) : (

                          <span className="badge text-bg-warning">
                            Submitted
                          </span>

                        )}

                      </td>


                      <td>

                        {result.status !==
                          "published" && (

                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              publish(
                                result._id
                              )
                            }
                          >
                            Publish Marks
                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {results.length === 0 && (
            <p className="small-muted">
              No result reports available.
            </p>
          )}

        </div>

      )}

    </div>
  );
}