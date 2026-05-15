import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Save, Camera } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

const AdminSettings = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "+91 98765 43210", org: "Hope & Help Foundation" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
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
      setError(result.message || "Failed to update settings.");
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your admin profile and preferences" />

      {saved && (
        <div className="auth-alert auth-alert-success mb-4 animate-fade-in-up">
          <i className="bi bi-check-circle-fill me-2" />Settings saved successfully!
        </div>
      )}
      {error && (
        <div className="auth-alert auth-alert-error mb-4 animate-fade-in-up">
          <i className="bi bi-exclamation-circle-fill me-2" />{error}
        </div>
      )}

      <div className="dash-row">
        {/* Profile card */}
        <div className="dash-card dash-card-sm text-center">
          <div className="settings-avatar-wrap">
            <img src={user?.avatar} alt={user?.name} className="settings-avatar" />
            <button className="settings-avatar-btn"><Camera size={16} /></button>
          </div>
          <h5 className="mt-3 fw-bold">{user?.name}</h5>
          <p className="text-muted">{user?.email}</p>
          <span className="role-pill" style={{ background: "#7C3AED18", color: "#7C3AED" }}>
            🛡️ <span className="ms-1">Admin</span>
          </span>
          <div className="settings-stats mt-4">
            <div><strong>48</strong><span>Articles</span></div>
            <div><strong>1.2K</strong><span>Users</span></div>
            <div><strong>₹2.4L</strong><span>Managed</span></div>
          </div>
        </div>

        {/* Form */}
        <div className="dash-card dash-card-lg">
          <h5 className="dash-card-title mb-4">Profile Information</h5>
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input className="dash-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email Address</label>
                <input type="email" className="dash-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone Number</label>
                <input className="dash-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Organization</label>
                <input className="dash-input" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
              </div>
              <div className="col-12 mt-2">
                <button type="submit" className="dash-btn dash-btn-primary" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : <><Save size={16} className="me-2" />Save Changes</>}
                </button>
              </div>
            </div>
          </form>

          <hr className="my-4" />
          <h5 className="dash-card-title mb-4">Change Password</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Current Password</label>
              <input type="password" className="dash-input" placeholder="••••••••" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">New Password</label>
              <input type="password" className="dash-input" placeholder="••••••••" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input type="password" className="dash-input" placeholder="••••••••" />
            </div>
            <div className="col-12">
              <button className="dash-btn dash-btn-outline">Update Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
