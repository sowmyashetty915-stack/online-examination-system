import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    otp: "",
  });

  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const nav = useNavigate();

  // Request OTP
  const req = async () => {
    setError("");
    setMsg("");
    setDevOtp("");

    try {
      const response = await api.post("/auth/request-otp", {
        email: form.email,
      });

      setSent(true);
      setDevOtp(response.data.devOtp || "");
      setMsg(response.data.message || "OTP sent successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not send OTP"
      );
    }
  };

  // Submit registration
  const submit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await api.post("/auth/register", form);

      alert(
        "Registration successful. Wait for admin approval."
      );

      nav("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card p-4">
            <h2>New Candidate Registration</h2>

            <p className="small-muted">
              Email must be valid and original. Password requires
              uppercase, lowercase, number and special character.
            </p>

            {/* Error */}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Success / OTP message */}
            {msg && (
              <div className="alert alert-info">
                {msg}

                {devOtp && (
                  <>
                    <br />
                    <strong>
                      Development OTP: {devOtp}
                    </strong>
                  </>
                )}
              </div>
            )}

            <form onSubmit={submit}>
              {/* Full Name */}
              <input
                className="form-control mb-3"
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              {/* Email + OTP */}
              <div className="input-group mb-3">
                <input
                  className="form-control"
                  type="email"
                  required
                  placeholder="Valid Email ID"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={req}
                >
                  Send OTP
                </button>
              </div>

              {/* OTP */}
              {sent && (
                <input
                  className="form-control mb-3"
                  required
                  placeholder="6-digit OTP"
                  value={form.otp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      otp: e.target.value,
                    })
                  }
                />
              )}

              {/* Password */}
              <input
                className="form-control mb-3"
                type="password"
                required
                minLength="8"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              {/* Role */}
              <select
                className="form-select mb-3"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
              >
                <option value="student">
                  Student
                </option>

                <option value="teacher">
                  Teacher
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>

              {/* Register */}
              <button className="btn btn-primary w-100">
                Submit Registration
              </button>
            </form>

            <p className="mt-3 mb-0">
              Already registered?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
