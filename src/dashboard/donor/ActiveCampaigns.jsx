import React, { useEffect, useState } from "react";
import { Target, Heart } from "lucide-react";
import PageHeader from "../../Components/PageHeader";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL 

const COLORS = ["#0EA5E9","#7C3AED","#10B981","#F59E0B","#EF4444","#06B6D4"];

const ActiveCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API}/campaigns`)
      .then((r) => r.json())
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Active Campaigns" subtitle={`${campaigns.length} campaigns running`} />

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-success" /></div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state"><Target size={40} /><p>No campaigns found.</p></div>
      ) : (
        <div className="row g-4">
          {campaigns.map((c, i) => {
            const color = COLORS[i % COLORS.length];
            const pct   = c.target > 0 ? Math.min(100, Math.round((c.raised / c.target) * 100)) : 0;
            return (
              <div key={c._id} className="col-lg-6">
                <div className="campaign-card animate-fade-in-up" style={{ borderTop: `3px solid ${color}` }}>
                  <div className="campaign-card-header">
                    <div>
                      <h5 className="campaign-card-title">{c.name}</h5>
                      <span className="campaign-tag">{c.category}</span>
                    </div>
                    <span className="campaign-pct" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="campaign-bar-bg mb-2">
                    <div className="campaign-bar-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <div className="campaign-amounts mb-3">
                    <span className="fw-bold">₹{(c.raised || 0).toLocaleString("en-IN")} raised</span>
                    <span className="text-muted">of ₹{(c.target || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="campaign-card-footer">
                    <span className={`status-pill ${c.status === "Active" ? "status-completed" : "status-pending"}`}>{c.status}</span>
                    <Link to="/donate" className="dash-btn" style={{ background: color, color: "#fff", border: "none", padding: "8px 20px", fontSize: "0.85rem" }}>
                      <Heart size={14} className="me-1" />Donate
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveCampaigns;
