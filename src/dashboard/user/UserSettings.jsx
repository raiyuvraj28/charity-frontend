import React, { useState } from "react";
import { Save, Bell, Shield, Globe } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

const UserSettings = () => {
  const [notifs, setNotifs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user_notifs")) || { email: true, push: false, newsletter: true };
    } catch {
      return { email: true, push: false, newsletter: true };
    }
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("user_notifs", JSON.stringify(notifs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      {saved && (
        <div className="auth-alert auth-alert-success mb-4 animate-fade-in-up">
          <i className="bi bi-check-circle-fill me-2" />Settings saved!
        </div>
      )}

      <div className="row g-4">
        {/* Notifications */}
        <div className="col-lg-6">
          <div className="dash-card h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Bell size={20} style={{ color: "#0EA5E9" }} />
              <h5 className="dash-card-title mb-0">Notifications</h5>
            </div>
            {[
              { key: "email",      label: "Email Notifications",  desc: "Receive updates via email" },
              { key: "push",       label: "Push Notifications",   desc: "Browser push alerts" },
              { key: "newsletter", label: "Newsletter",           desc: "Monthly impact reports" },
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

        {/* Security */}
        <div className="col-lg-6">
          <div className="dash-card h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Shield size={20} style={{ color: "#10B981" }} />
              <h5 className="dash-card-title mb-0">Security</h5>
            </div>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Current Password</label>
                <input type="password" className="dash-input" placeholder="••••••••" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">New Password</label>
                <input type="password" className="dash-input" placeholder="••••••••" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input type="password" className="dash-input" placeholder="••••••••" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <button className="dash-btn dash-btn-primary" onClick={handleSave}>
            <Save size={16} className="me-2" />Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
