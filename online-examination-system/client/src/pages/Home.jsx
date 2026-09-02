import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">

              <h3 className="display-4 fw-bold" style={{color:'black', fontSize:'49px'}}>Shape Your Future at
<h3 className="display-4 fw-bold" style={{color:'#e78d2d', fontSize:'49px'}}>St. Mary’s Syrian</h3>
College
              </h3>
<br/>
              <p className="lead">
                Believe in yourself and give your best.<br/>
Your hard work will lead you to success. 🌟
              </p>

              <div className="d-flex gap-2">
                <Link
                to="/login"
                className="login-btn btn-lg btn btn-outline-light">
            🔐 Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-light btn-lg"
                >
                   📝New Candidate Registration
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-art"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5" id="roles">
        <div className="text-center mb-5">
          <h2>College Portal</h2>
          <p className="small-muted">
            Scroll down to explore each dashboard
          </p>
        </div>

        <div className="row g-4">
          <Role
            title="Student Dashboard"
            icon="🎓"
            text="View exams, take timed MCQ examinations and view published results."
          />

          <Role
            title="Teacher Dashboard"
            icon="👨‍🏫"
            text="Create exams, manage questions and publish student result reports."
          />

          <Role
            title="Admin Dashboard"
            icon="🛡️"
            text="Manage student and teacher accounts, credentials and access."
          />
        </div>

        <div className="card p-4 mt-5"  style={{
    border: "2px solid #f6f6fa",
    border: "2px solid #f3f3f9",
    borderRadius: "15px",
    boxShadow:
     "0 0 5px #faf9fc, 0 0 15px rgba(235, 182, 9, 0.86)",
    transition: "all 0.3s ease",
  }}>
        <h4 style={{ textAlign:'center'}}><b>Believe in yourself and trust your preparation.<br/>
💪Every question is a chance to prove your strength.<br/>
🎯Stay focused, stay calm, and give your best.<br/>
Your hard work today will shape your tomorrow.🏆</b></h4>
<div className="row g-4 mt-3">

  {/* College Details */}
  <div className="col-md-6">
    <div className="card h-100 p-4" style={{
    backgroundColor: "#ffffff",
    border: "2px solid #f3f3f9",
    borderRadius: "15px",
    boxShadow:
      "0 0 5px #f8f7faec, 0 0 15px rgba(235, 182, 9, 0.86)",
    transition: "all 0.3s ease",
  }}>
      <table className="table table-borderless mb-0">
        <tbody>
            <tr>
            <td>
              <h3>🔵 College Info</h3>
            </td>
          </tr>
          <tr>
            <td>
              <h3>St. Mary’s Syrian College</h3>
              <h6>Deemed To Be College · Est. 1980</h6>
            </td>
          </tr>
          
          <tr>
            <td>
              A prestigious institution committed to
              <br />
              academic excellence, holistic development,
              <br />
              and value-based education in Brahmavar,
              <br />
              Karnataka, India.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  {/* Contact Us */}
  <div className="col-md-6">
    <div className="card h-100 p-4" style={{
    backgroundColor: "#ffffff",
    border: "2px solid #f3f3f9",
    borderRadius: "15px",
    boxShadow:
      "0 0 5px #fefdff, 0 0 15px rgba(235, 182, 9, 0.86)",
    transition: "all 0.3s ease",
  }}>
      <table className="table table-borderless mb-0">
        <tbody>
          <tr>
            <th>
              <h4>🟢 Contact Us</h4>
            </th>
          </tr>

          <tr>
            <td>
              📍 St. Mary’s Syrian College,
              <br />
                  Brahmavar, Karnataka, India.
            </td>
          </tr>

          <tr>
            <td>📞 6366415968</td>
          </tr>

          <tr>
            <td>📞 8951615968</td>
          </tr>

          <tr>
            <td>✉ sms_college@yahoo.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div>
        </div>
      </section>
    </>
  );
}

function Role({ title, icon, text }) {
  return (
    <div className="col-md-4">
      <div className="card h-100 p-4">
        <div className="display-5">{icon}</div>

        <h4 className="mt-3">{title}</h4>

        <p className="small-muted">{text}</p>

        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
