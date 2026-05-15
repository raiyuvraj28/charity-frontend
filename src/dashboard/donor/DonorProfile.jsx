import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Camera, Save, Bell, Shield } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

const DonorProfile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", city: user?.city || "", bio: user?.bio || "" });
  const [notifs, setNotifs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("donor_notifs")) || { email: true, push: true, newsletter: false };
    } catch {
      return { email: true, push: true, newsletter: false };
    }
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await updateProfile({
      name: form.name,
      phone: form.phone,
      city: form.city,
      bio: form.bio,
    });
    setLoading(false);
    if (result.success) {
      localStorage.setItem("donor_notifs", JSON.stringify(notifs));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.message || "Failed to update profile.");
    }
  };

  return (
    <div>
      <PageHeader title="Profile Settings" subtitle="Manage your donor profile" />

      {saved && (
        <div className="auth-alert auth-alert-success mb-4 animate-fade-in-up">
          <i className="bi bi-check-circle-fill me-2" />Profile updated!
        </div>
      )}
      {error && (
        <div className="auth-alert auth-alert-error mb-4 animate-fade-in-up">
          <i className="bi bi-exclamation-circle-fill me-2" />{error}
        </div>
      )}

      <div className="dash-row">
        {/* Avatar card */}
        <div className="dash-card dash-card-sm text-center">
          <div className="settings-avatar-wrap">
            <img src={user?.avatar} alt={user?.name} className="settings-avatar" />
            <button className="settings-avatar-btn" style={{ background: "#10B981" }}><Camera size={16} /></button>
          </div>
          <h5 className="mt-3 fw-bold">{user?.name}</h5>
          <p className="text-muted">{user?.email}</p>
          <span className="role-pill" style={{ background: "#10B98118", color: "#10B981" }}>
            💚 <span className="ms-1">Donor</span>
          </span>
          <div className="settings-stats mt-4">
            <div><strong>4</strong><span>Campaigns</span></div>
            <div><strong>₹18K</strong><span>Donated</span></div>
            <div><strong>Platinum</strong><span>Rank</span></div>
          </div>
        </div>

        {/* Form */}
        <div className="dash-card dash-card-lg">
          <h5 className="dash-card-title mb-4">Personal Information</h5>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input className="dash-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email Address</label>
                <input type="email" className="dash-input" value={form.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone</label>
                <input className="dash-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">City</label>
                <input className="dash-input" placeholder="Your city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Bio</label>
                <textarea className="dash-input" rows={3} placeholder="Why do you donate?" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div className="col-12">
                <button type="submit" className="dash-btn" style={{ background: "#10B981", color: "white", border: "none" }} disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : <><Save size={16} className="me-2" />Save Changes</>}
                </button>
              </div>
            </div>
          </form>

          <hr className="my-4" />
          <div className="d-flex align-items-center gap-2 mb-3">
            <Bell size={18} style={{ color: "#10B981" }} />
            <h5 className="dash-card-title mb-0">Notification Preferences</h5>
          </div>
          {[
            { key: "email",      label: "Email Notifications",  desc: "Campaign updates via email" },
            { key: "push",       label: "Push Notifications",   desc: "Real-time browser alerts" },
            { key: "newsletter", label: "Monthly Newsletter",   desc: "Impact reports & stories" },
          ].map((n) => (
            <div key={n.key} className="settings-toggle-row">
              <div>
                <p className="fw-semibold mb-0">{n.label}</p>
                <small className="text-muted">{n.desc}</small>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifs[n.key]} onChange={() => setNotifs({ ...notifs, [n.key]: !notifs[n.key] })} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
