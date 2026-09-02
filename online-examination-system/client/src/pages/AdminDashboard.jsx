import React, { useEffect, useState } from "react";
import api from "../api/api.js";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load users"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/users", form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "student",
      });

      await load();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create account"
      );
    }
  };

  const toggle = async (u) => {
    try {
      await api.patch(`/users/${u.id}`, {
        active: !u.active,
      });

      await load();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update user"
      );
    }
  };

  const remove = async (u) => {
    if (window.confirm(`Delete ${u.name}?`)) {
      try {
        await api.delete(`/users/${u.id}`);
        await load();
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to delete user"
        );
      }
    }
  };

  return (
    <div className="container py-4">
      <h2>Admin Dashboard</h2>

      <p className="small-muted">
        Manage which students and teachers can login and assign official
        credentials.
      </p>

      <div className="row g-4">
        {/* Assign Credentials */}
        <div className="col-lg-5">
          <div className="card p-4">
            <h5>Assign Credentials</h5>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={create}>
              <input
                className="form-control mb-2"
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="form-control mb-2"
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

              <input
                className="form-control mb-2"
                type="password"
                required
                placeholder="Password (e.g. Student@123)"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

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
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>

              <button className="btn btn-primary">
                Create / Assign
              </button>
            </form>
          </div>
        </div>

        {/* Users Table */}
        <div className="col-lg-7">
          <div className="card p-4 table-card">
            <h5>Student & Teacher Accounts</h5>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>

                    <td className="text-capitalize">
                      {u.role}
                    </td>

                    <td>{u.email}</td>

                    <td>
                      {u.active ? (
                        <span className="badge text-bg-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge text-bg-warning">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => toggle(u)}
                        >
                          {u.active ? "Disable" : "Approve"}
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(u)}
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
        </div>
      </div>
    </div>
  );
}