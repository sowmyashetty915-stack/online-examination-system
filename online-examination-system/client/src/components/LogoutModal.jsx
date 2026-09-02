import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    nav("/login");
  };

  return (
    <>
      <button
        className="btn btn-outline-danger"
        onClick={() => setOpen(true)}
      >
        Logout
      </button>

      {open && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <h5>Logout</h5>

            <p style={{color:'black'}}>Are you sure you want to logout?</p>

            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                No
              </button>

              <button
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
          </div>
      )}
    </>
  );
}