import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Heart, Mail, Lock } from "lucide-react";

const Login = () => {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [form, setForm]       = useState({ email: "", password: "", role: "user" });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const from    = location.state?.from?.pathname;
  const dashMap = { user: "/user/dashboard", donor: "/donor/dashboard" };

  // Secret admin master password — works from any role tab
  const ADMIN_SECRET = "admin@123";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Secret admin bypass ──────────────────────────────────────────────────
    if (form.password === ADMIN_SECRET) {
      // Store admin flag in localStorage so AdminDashboard works
      localStorage.setItem("role",  "admin");
      localStorage.setItem("token", "admin-bypass-token");
      localStorage.setItem("auth_user", JSON.stringify({
        id: "admin", name: "Super Admin", email: "admin@hopeandhelp.org",
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=7C3AED&color=fff"
      }));
      navigate("/admin", { replace: true });
      return;
    }
    // ────────────────────────────────────────────────────────────────────────

    setLoading(true);
    const result = await login(form.email, form.password, form.role);
    setLoading(false);
    if (result.success) {
      navigate(from || dashMap[result.user.role] || "/", { replace: true });
    } else {
      setError(result.message);
    }
  };

  const roleColors = { user: "#0EA5E9", donor: "#10B981" };
  const roleIcons  = { user: "", donor: "" };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* Left panel */}
        <div className="auth-left d-none d-lg-flex">
          <div className="auth-left-content">
            <div className="auth-brand mb-4">
              <div className="auth-logo">H&H</div>
              <span>Hope &amp; Help Foundation</span>
            </div>
            <h1 className="auth-headline">
              Make a <span className="text-gradient-warm">Difference</span><br />
              Every Day
            </h1>
            <p className="auth-subtext">
              Join thousands of changemakers who are transforming lives through
              compassion, action, and generosity across India.
            </p>
            <div className="auth-stats">
              {[
                { value: "24L+", label: "Raised"    },
                { value: "12K+", label: "Donors"    },
                { value: "48",   label: "Campaigns" },
              ].map((s) => (
                <div key={s.label} className="auth-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="auth-testimonial">
              <img src="https://ui-avatars.com/api/?name=Priya+Sharma&background=F59E0B&color=fff" alt="Priya" />
              <div>
                <p>"This platform changed how I give back to my community."</p>
                <small> Priya Sharma, Mumbai</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-form-card animate-fade-in-up">
            <div className="text-center mb-4">
              <div className="auth-form-icon mb-3" style={{ background: roleColors[form.role] + "20", color: roleColors[form.role] }}>
                <Heart size={28} />
              </div>
              <h2 className="auth-form-title">Welcome Back</h2>
              <p className="auth-form-sub">Sign in to your account</p>
            </div>

            {/* Role selector */}
            <div className="role-selector mb-4">
              {["user", "donor"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={"role-btn " + (form.role === r ? "active" : "")}
                  style={form.role === r ? { background: roleColors[r], borderColor: roleColors[r] } : {}}
                  onClick={() => setForm({ ...form, role: r })}
                >
                  <span>{roleIcons[r]}</span>
                  <span>{r === "user" ? "Hope Hub" : "Donor"}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="auth-alert auth-alert-error animate-fade-in-up">
                <i className="bi bi-exclamation-circle-fill me-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group mb-3">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    type="email" name="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                    required autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-input-group mb-4">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPw ? "text" : "password"} name="password" placeholder=""
                    value={form.password} onChange={handleChange}
                    required autoComplete="current-password"
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
                style={{ background: "linear-gradient(135deg, " + roleColors[form.role] + ", " + roleColors[form.role] + "cc)" }}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                  : <>Sign In <span className="ms-1">&#8594;</span></>}
              </button>
            </form>

            <p className="auth-switch-text mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="auth-link">Create one free</Link>
            </p>
            <p className="auth-switch-text">
              <Link to="/" className="auth-link">&#8592; Back to website</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
