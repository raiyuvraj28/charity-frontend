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
    <nav className="navbar navbar-expand-lg fixed-top glass-panel px-3 py-2">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div style={{
            background: "var(--primary)", color: "white", width: "40px", height: "40px",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "10px", fontWeight: "bold", fontSize: "1.2rem"
          }}>H&H</div>
          <div className="d-flex flex-column justify-content-center pt-1">
            <h5 className="mb-0 fw-bold lh-1" style={{ color: "var(--primary-dark)" }}>Hope & Help</h5>
            <small className="d-block text-muted mt-1" style={{ fontSize: "0.75rem", lineHeight: "1" }}>Foundation</small>
          </div>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item"><Link className="nav-link fw-medium" to="/home">Home</Link></li>
            <li className="nav-item"><a className="nav-link fw-medium" href="/#About">About</a></li>
            <li className="nav-item"><a className="nav-link fw-medium" href="/#causes">Causes</a></li>
            <li className="nav-item"><a className="nav-link fw-medium" href="/#volunteer">Volunteer</a></li>

            {/* News Dropdown */}
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle btn btn-link fw-medium text-decoration-none" data-bs-toggle="dropdown">
                News
              </button>
              <ul className="dropdown-menu glass-card border-0 shadow-lg mt-2">
                <li><Link className="dropdown-item py-2" to="/news">News Listing</Link></li>
                <li><Link className="dropdown-item py-2" to="/news/1">News Detail</Link></li>
              </ul>
            </li>

            <li className="nav-item"><a className="nav-link fw-medium" href="/#contact">Contact</a></li>

            {/* Donate */}
            <li className="nav-item ms-lg-2">
              <Link className="btn-premium btn-accent py-2 px-4" to="/donate" style={{ fontSize: "0.9rem" }}>
                Donate Now
              </Link>
            </li>

            {/* Auth buttons — NO dropdown */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="btn-premium btn-secondary py-2 px-4" to="/login" style={{ fontSize: "0.9rem" }}>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn-premium btn-primary py-2 px-4" to="/signup" style={{ fontSize: "0.9rem" }}>
                    <i className="bi bi-person-plus me-1"></i> Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="btn-premium btn-secondary py-2 px-3 d-flex align-items-center gap-2"
                    to={dashMap[user.role]}
                    style={{ fontSize: "0.9rem" }}
                  >
                    <img src={user.avatar} alt={user.name} style={{ width: 22, height: 22, borderRadius: "50%" }} />
                    {user.name.split(" ")[0]}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn-premium btn-secondary py-2 px-3"
                    onClick={handleLogout}
                    style={{ fontSize: "0.9rem", color: "#ef4444", borderColor: "#fecaca" }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
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
