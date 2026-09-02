import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LogoutButton from "./LogoutModal.jsx";

export default function NavBar() {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-primary px-3">
      <Link className="navbar-brand fw-bold" to="/">
        College Exam Portal
      </Link>

      <div className="d-flex align-items-center gap-3 text-white">
        {user && (
          <>
            <span>
              {user.name} ({user.role})
            </span>

            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
}