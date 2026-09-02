import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

export default function TakeExam() {
  const { id } = useParams();
  const nav = useNavigate();

  const [exam, setExam] = useState(null);
  const [qs, setQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load exam and questions
  useEffect(() => {
    const loadExam = async () => {
      try {
        const [examResponse, questionsResponse] =
          await Promise.all([
            api.get(`/exams/${id}`),
            api.get(`/questions/student/${id}`),
          ]);

        const examData = examResponse.data;
        const questionsData = questionsResponse.data;

        setExam(examData);
        setQs(questionsData);

        const endTime =
          new Date(examData.examDate).getTime() +
          examData.durationMinutes * 60000;

        const remainingSeconds = Math.max(
          0,
          Math.floor((endTime - Date.now()) / 1000)
        );

        setLeft(remainingSeconds);
      } catch (e) {
        setError(
          e.response?.data?.message ||
            "Unable to open exam"
        );
      }
    };

    loadExam();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!exam || submitting) return;

    const timer = setInterval(() => {
      setLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, submitting]);

  // Automatically submit when time reaches zero
  useEffect(() => {
    if (
      exam &&
      left === 0 &&
      !submitting
    ) {
      submitExam();
    }
  }, [left, exam]);

  // Select answer
  const choose = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [qs[idx]._id]: Number(value),
    }));
  };

  // Submit exam
  const submitExam = async () => {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await api.post("/results/submit", {
        examId: id,
        answers: Object.entries(answers).map(
          ([question, selected]) => ({
            question,
            selected,
          })
        ),
      });

      alert("Exam submitted successfully.");

      nav("/student");
    } catch (e) {
      setSubmitting(false);

      setError(
        e.response?.data?.message ||
          "Submission failed"
      );
    }
  };

  // Error
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  // Loading
  if (!exam || !qs.length) {
    return (
      <div className="container py-5">
        Loading exam...
      </div>
    );
  }

  const q = qs[idx];

  const min = Math.floor(left / 60);
  const sec = left % 60;

  return (
    <div className="container py-4">
      <div className="card p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3>{exam.title}</h3>

            <p className="small-muted mb-0">
              {exam.subject}
            </p>
          </div>

          <div className="timer">
            Time Left:{" "}
            {String(min).padStart(2, "0")}:
            {String(sec).padStart(2, "0")}
          </div>
        </div>

        <hr />

        {/* Question information */}
        <div className="d-flex justify-content-between">
          <span>
            Question {idx + 1} of {qs.length}
          </span>

          <span>
            Answered: {Object.keys(answers).length}
          </span>
        </div>

        {/* Question */}
        <h5 className="mt-4">
          {q.text}
        </h5>

        {/* Options */}
        <div className="mt-3">
          {q.options.map((option, i) => (
            <label
              className={
                "option d-block " +
                (answers[q._id] === i
                  ? "selected"
                  : "")
              }
              key={i}
            >
              <input
                className="me-2"
                type="radio"
                name={`question-${q._id}`}
                checked={
                  answers[q._id] === i
                }
                onChange={() => choose(i)}
              />

              <strong>
                {String.fromCharCode(65 + i)}.
              </strong>{" "}
              {option}
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="d-flex justify-content-between mt-4">

          <button
            className="btn btn-outline-secondary"
            disabled={idx === 0 || submitting}
            onClick={() =>
              setIdx(idx - 1)
            }
          >
            Previous
          </button>

          <div className="d-flex gap-2">

            {idx < qs.length - 1 && (
              <button
                className="btn btn-outline-primary"
                disabled={submitting}
                onClick={() =>
                  setIdx(
                    Math.min(
                      qs.length - 1,
                      idx + 1
                    )
                  )
                }
              >
                Save & Next
              </button>
            )}

            {idx === qs.length - 1 && (
              <button
                className="btn btn-danger"
                disabled={submitting}
                onClick={submitExam}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Exam"}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}