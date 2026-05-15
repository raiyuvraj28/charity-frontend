import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Camera, Save } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name:  user?.name  || "",
    phone: user?.phone || "",
    city:  user?.city  || "",
    bio:   user?.bio   || "",
  });
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await updateProfile(form);
    setLoading(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information" />

      {saved && (
        <div className="auth-alert auth-alert-success mb-4 animate-fade-in-up">
          <i className="bi bi-check-circle-fill me-2" />Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="auth-alert auth-alert-error mb-4 animate-fade-in-up">
          <i className="bi bi-exclamation-circle-fill me-2" />{error}
        </div>
      )}

      <div className="dash-row">
        <div className="dash-card dash-card-sm text-center">
          <div className="settings-avatar-wrap">
            <img src={user?.avatar} alt={user?.name} className="settings-avatar" />
            <button className="settings-avatar-btn"><Camera size={16} /></button>
          </div>
          <h5 className="mt-3 fw-bold">{user?.name}</h5>
          <p className="text-muted">{user?.email}</p>
          <span className="role-pill" style={{ background: "#0EA5E918", color: "#0EA5E9" }}>
            👤 <span className="ms-1">User</span>
          </span>
        </div>

        <div className="dash-card dash-card-lg">
          <h5 className="dash-card-title mb-4">Personal Information</h5>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input className="dash-input" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email Address</label>
                <input className="dash-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone Number</label>
                <input className="dash-input" placeholder="+91 XXXXX XXXXX" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">City</label>
                <input className="dash-input" placeholder="Your city" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Bio</label>
                <textarea className="dash-input" rows={3} placeholder="Tell us about yourself..."
                  value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div className="col-12">
                <button type="submit" className="dash-btn dash-btn-primary" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : <><Save size={16} className="me-2" />Save Changes</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
