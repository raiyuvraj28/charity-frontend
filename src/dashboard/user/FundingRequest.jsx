import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { HandCoins, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

import { API_BASE_URL as API } from "../../config/api";

const FundingRequest = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const [success,  setSuccess]  = useState("");
  const [error,    setError]    = useState("");
  const [form, setForm] = useState({ title: "", description: "", amount: "", photoUrl: "" });
  const fileRef = useRef();

  const fetchRequests = () => {
    const token = localStorage.getItem("token");
    fetch(`${API}/funding/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  // Convert image to base64
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Image must be under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, photoUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.title || !form.description || !form.amount) { setError("All fields are required."); return; }
    if (Number(form.amount) <= 0) { setError("Amount must be greater than 0."); return; }
    setSending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/funding`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, amount: Number(form.amount) })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.message || "Failed to submit."); }
      else {
        setSuccess("Request submitted! Admin will review and notify you by email.");
        setForm({ title: "", description: "", amount: "", photoUrl: "" });
        fetchRequests();
        setTimeout(() => setSuccess(""), 5000);
      }
    } catch { setError("Cannot connect to server."); }
    setSending(false);
  };

  const statusIcon = { pending: <Clock size={14}/>, approved: <CheckCircle size={14}/>, rejected: <XCircle size={14}/> };
  const statusColor = { pending: "#F59E0B", approved: "#10B981", rejected: "#ef4444" };

  return (
    <div>
      <PageHeader title="Request Funding" subtitle="Submit a request for financial assistance" />

      {/* Submit form */}
      <div className="dash-card mb-4">
        <h5 className="dash-card-title mb-4">New Funding Request</h5>

        {success && <div className="auth-alert auth-alert-success mb-3 animate-fade-in-up"><CheckCircle size={16} className="me-2"/>{success}</div>}
        {error   && <div className="auth-alert auth-alert-error   mb-3 animate-fade-in-up"><i className="bi bi-exclamation-circle-fill me-2"/>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Request Title *</label>
              <input className="dash-input" placeholder="e.g. Medical treatment for my child"
                value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Amount Required (₹) *</label>
              <input className="dash-input" type="number" min="1" placeholder="e.g. 15000"
                value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} required />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description *</label>
              <textarea className="dash-input" rows={4}
                placeholder="Explain your situation in detail. Why do you need this funding? How will it be used?"
                value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} required />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Supporting Photo (optional, max 2MB)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <button type="button" className="dash-btn dash-btn-outline"
                  onClick={() => fileRef.current.click()}>
                  <Upload size={16} className="me-2" />Upload Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
                {form.photoUrl && (
                  <div style={{ position: "relative" }}>
                    <img src={form.photoUrl} alt="preview"
                      style={{ height: "80px", width: "120px", objectFit: "cover", borderRadius: "8px", border: "2px solid #e2e8f0" }} />
                    <button type="button" onClick={() => setForm(f => ({...f, photoUrl: ""}))}
                      style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "22px", height: "22px", fontSize: "0.75rem", cursor: "pointer" }}>✕</button>
                  </div>
                )}
              </div>
              <small className="text-muted">Upload a photo that supports your request (medical report, damaged property, etc.)</small>
            </div>
            <div className="col-12">
              <button type="submit" className="dash-btn dash-btn-primary" disabled={sending}>
                {sending
                  ? <><span className="spinner-border spinner-border-sm me-2"/>Submitting...</>
                  : <><HandCoins size={16} className="me-2"/>Submit Request</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* My requests */}
      <div className="dash-card">
        <h5 className="dash-card-title mb-4">My Requests</h5>
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
        ) : requests.length === 0 ? (
          <div className="empty-state"><HandCoins size={40} /><p>No requests submitted yet.</p></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {requests.map(r => (
              <div key={r._id} style={{ background: "#f8fafc", borderRadius: "12px", padding: "1.25rem", borderLeft: `4px solid ${statusColor[r.status]}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <h6 style={{ fontWeight: 700, margin: "0 0 4px" }}>{r.title}</h6>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontWeight: 800, color: "#0EA5E9", fontSize: "1.1rem" }}>₹{r.amount?.toLocaleString("en-IN")}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", background: `${statusColor[r.status]}18`, color: statusColor[r.status], padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700 }}>
                      {statusIcon[r.status]} {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p style={{ margin: "10px 0 0", fontSize: "0.88rem", color: "#475569" }}>{r.description}</p>
                {r.userMessage && (
                  <div style={{ marginTop: "10px", background: r.status === "approved" ? "#ecfdf5" : `${statusColor[r.status]}12`, borderLeft: `3px solid ${statusColor[r.status]}`, padding: "12px 14px", borderRadius: "8px", fontSize: "0.88rem", color: "#1e293b" }}>
                    <strong style={{ display: "block", marginBottom: "6px", color: statusColor[r.status] }}>
                      {r.status === "approved" ? "Message from Admin" : "Update from Admin"}
                    </strong>
                    {r.userMessage}
                  </div>
                )}
                {r.adminNote && r.adminNote !== r.userMessage && (
                  <div style={{ marginTop: "10px", background: `${statusColor[r.status]}12`, borderLeft: `3px solid ${statusColor[r.status]}`, padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem" }}>
                    <strong>Admin Note:</strong> {r.adminNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingRequest;
