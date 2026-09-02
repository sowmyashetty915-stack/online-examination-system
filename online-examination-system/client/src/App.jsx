
import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";

import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TakeExam from "./pages/TakeExam.jsx";
import StudentResults from "./pages/StudentResults.jsx";

function App() {
  const { user } = useAuth();

  const home = user ? (
    <Navigate
      to={`/${user.role}`}
      replace
    />
  ) : null;

  return (
    <>
      <NavBar />

      <Routes>

        {/* =====================================================
            HOME
        ===================================================== */}
        <Route
          path="/"
          element={
            home || <Home />
          }
        />


        {/* =====================================================
            LOGIN
        ===================================================== */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={`/${user.role}`}
                replace
              />
            ) : (
              <Login />
            )
          }
        />


        {/* =====================================================
            REGISTER
        ===================================================== */}
        <Route
          path="/register"
          element={
            user ? (
              <Navigate
                to={`/${user.role}`}
                replace
              />
            ) : (
              <Register />
            )
          }
        />


        {/* =====================================================
            ADMIN
        ===================================================== */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              roles={["admin"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TEACHER
        ===================================================== */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute
              roles={["teacher"]}
            >
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT DASHBOARD
        ===================================================== */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute
              roles={["student"]}
            >
              <StudentDashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            TAKE EXAM
        ===================================================== */}
        <Route
          path="/student/exam/:id"
          element={
            <ProtectedRoute
              roles={["student"]}
            >
              <TakeExam />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            STUDENT RESULTS
        ===================================================== */}
        <Route
          path="/student/results"
          element={
            <ProtectedRoute
              roles={["student"]}
            >
              <StudentResults />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            PAGE NOT FOUND
        ===================================================== */}
        <Route
          path="*"
          element={
            <div className="container py-5 text-center">

              <h3>
                Page not found
              </h3>

              <Link
                to="/"
                className="btn btn-primary mt-3"
              >
                Go Home
              </Link>

            </div>
          }
        />

      </Routes>
    </>
  );
}

export default App;