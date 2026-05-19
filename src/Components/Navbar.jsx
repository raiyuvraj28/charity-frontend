import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashMap = { admin: "/admin/dashboard", user: "/user/dashboard", donor: "/donor/dashboard" };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-xl site-navbar fixed-top glass-panel py-2">
      <div className="container-fluid navbar-inner px-3 px-lg-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 flex-shrink-0" to="/">
          <div style={{
            background: "var(--primary)", color: "white", width: "40px", height: "40px",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "10px", fontWeight: "bold", fontSize: "1.2rem"
          }}>H&H</div>
          <div className="d-flex flex-column justify-content-center pt-1 navbar-brand-text">
            <h5 className="mb-0 fw-bold lh-1" style={{ color: "var(--primary-dark)" }}>Hope & Help</h5>
            <small className="d-block text-muted mt-1 navbar-brand-sub" style={{ fontSize: "0.75rem", lineHeight: "1" }}>Foundation</small>
          </div>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav navbar-nav-links mx-xl-auto align-items-xl-center">
            <li className="nav-item"><Link className="nav-link fw-medium" to="/home">Home</Link></li>
            <li className="nav-item"><a className="nav-link fw-medium" href="/#About">About</a></li>
            <li className="nav-item"><a className="nav-link fw-medium" href="/#causes">Causes</a></li>
            <li className="nav-item"><a className="nav-link fw-medium" href="/#volunteer">Volunteer</a></li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link fw-medium text-decoration-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                News
              </button>
              <ul className="dropdown-menu glass-card border-0 shadow-lg mt-2">
                <li><Link className="dropdown-item py-2" to="/news">News Listing</Link></li>
                <li><Link className="dropdown-item py-2" to="/news/1">News Detail</Link></li>
              </ul>
            </li>
            <li className="nav-item"><a className="nav-link fw-medium" href="/#contact">Contact</a></li>
          </ul>

          <ul className="navbar-nav navbar-nav-actions align-items-xl-center flex-shrink-0">
            <li className="nav-item">
              <Link className="btn-premium btn-accent navbar-cta" to="/donate">
                Donate Now
              </Link>
            </li>
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="btn-premium btn-secondary navbar-cta" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i> Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn-premium btn-primary navbar-cta" to="/signup">
                    <i className="bi bi-person-plus me-1" aria-hidden="true"></i> Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="btn-premium btn-secondary navbar-cta d-flex align-items-center gap-2"
                    to={dashMap[user.role]}
                  >
                    <img src={user.avatar} alt={user.name} style={{ width: 22, height: 22, borderRadius: "50%" }} />
                    {user.name.split(" ")[0]}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn-premium btn-secondary navbar-cta navbar-logout"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1" aria-hidden="true"></i> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
