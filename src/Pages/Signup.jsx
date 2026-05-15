import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Heart, Mail, Lock, User } from "lucide-react";

const Signup = () => {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "", role: "user" });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const dashMap    = { user: "/user/dashboard", donor: "/donor/dashboard" };
  const roleColors = { user: "#0EA5E9", donor: "#10B981" };
  const roleIcons  = { user: "", donor: "" };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6)       { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const result = await signup(form.name, form.email, form.password, form.role);
    setLoading(false);
    if (result.success) {
      navigate(dashMap[result.user.role] || "/", { replace: true });
    } else {
      setError(result.message);
    }
  };

  const strength      = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981"];

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
              Start Your <span className="text-gradient-warm">Journey</span><br />
              of Giving
            </h1>
            <p className="auth-subtext">
              Create your account and become part of a community that believes
              in the power of collective kindness across India.
            </p>
            <div className="auth-features">
              {[
                { icon: "", text: "Track your impact in real-time"        },
                { icon: "", text: "Secure and transparent transactions"    },
                { icon: "", text: "Support causes across India"           },
                { icon: "", text: "Detailed donation analytics & reports"  },
              ].map((f) => (
                <div key={f.text} className="auth-feature-item">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
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
              <h2 className="auth-form-title">Create Account</h2>
              <p className="auth-form-sub">Join our community today</p>
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
                <i className="bi bi-exclamation-circle-fill me-2" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group mb-3">
                <label>Full Name</label>
                <div className="auth-input-wrap">
                  <User size={18} className="auth-input-icon" />
                  <input type="text" name="name" placeholder="e.g. Rahul Sharma"
                    value={form.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="auth-input-group mb-3">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={18} className="auth-input-icon" />
                  <input type="email" name="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="auth-input-group mb-1">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPw ? "text" : "password"} name="password" placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange} required
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {form.password.length > 0 && (
                <div className="pw-strength mb-3">
                  <div className="pw-bars">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="pw-bar"
                        style={{ background: i <= strength ? strengthColor[strength] : "#e2e8f0" }} />
                    ))}
                  </div>
                  <span style={{ color: strengthColor[strength], fontSize: "0.75rem", fontWeight: 600 }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}

              <div className="auth-input-group mb-4">
                <label>Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    type={showPw ? "text" : "password"} name="confirm" placeholder="Repeat your password"
                    value={form.confirm} onChange={handleChange} required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
                style={{ background: "linear-gradient(135deg, " + roleColors[form.role] + ", " + roleColors[form.role] + "cc)" }}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                  : <>Create Account <span className="ms-1">&#8594;</span></>}
              </button>
            </form>

            <p className="auth-switch-text mt-4">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">Sign in</Link>
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

export default Signup;
