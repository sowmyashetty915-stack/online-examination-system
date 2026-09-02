import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      login(response.data);

      // Redirect based on user role
      nav(`/${response.data.user.role}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card p-4">
            <h2>Login</h2>

            <p className="small-muted">
              Use the active credentials assigned/approved by admin.
            </p>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              {/* Email */}
              <input
                className="form-control mb-3"
                type="email"
                required
                placeholder="Email ID"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              {/* Password */}
              <input
                className="form-control mb-3"
                type="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              {/* Login button */}
              <button
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Checking..." : "Submit Login"}
              </button>
            </form>

            <p className="mt-3 mb-0">
              New candidate?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

