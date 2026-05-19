import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, Clock, HandCoins, Target, ArrowRight } from "lucide-react";
import StatCard from "../../Components/StatCard";
import PageHeader from "../../Components/PageHeader";
import { Link } from "react-router-dom";

import { API_BASE_URL as API } from "../../config/api";

const UserHome = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${API}/campaigns`).then((r) => r.json()),
      fetch(`${API}/funding/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([camps, funding]) => {
        setCampaigns(Array.isArray(camps) ? camps.slice(0, 3) : []);
        setFundingRequests(Array.isArray(funding) ? funding : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const approvedRequests = fundingRequests.filter((r) => r.status === "approved");
  const pendingRequests = fundingRequests.filter((r) => r.status === "pending");
  const approvedTotal = approvedRequests.reduce((s, r) => s + (r.amount || 0), 0);
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "-";

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] || "Member"}`}
        subtitle="Hope Hub — track your funding requests and impact"
      />

      <div className="stats-grid">
        <StatCard icon={<HandCoins size={24} />} title="Approved Funds" value={`Rs.${approvedTotal.toLocaleString("en-IN")}`} trend={`${approvedRequests.length} approved`} trendUp color="#0EA5E9" delay={0} />
        <StatCard icon={<Clock size={24} />} title="Pending Requests" value={pendingRequests.length} trend="Waiting for admin" trendUp color="#F59E0B" delay={100} />
        <StatCard icon={<Target size={24} />} title="Active Campaigns" value={campaigns.length || "-"} trend="Foundation programs" trendUp color="#7C3AED" delay={200} />
        <StatCard icon={<CheckCircle size={24} />} title="Member Since" value={joinedDate} trend="Account active" trendUp color="#10B981" delay={300} />
      </div>

      <div className="dash-row mt-4">
        <div className="dash-card dash-card-lg">
          <div className="dash-card-header">
            <h5 className="dash-card-title">Active Campaigns</h5>
            <Link to="/user/funding" className="dash-btn dash-btn-outline">
              Request Funding <ArrowRight size={14} className="ms-1" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : campaigns.length === 0 ? (
            <p className="text-muted text-center py-4">No campaigns found.</p>
          ) : (
            <div className="campaign-list">
              {campaigns.map((c) => {
                const pct = c.target > 0 ? Math.min(100, Math.round((c.raised / c.target) * 100)) : 0;
                return (
                  <div key={c._id} className="campaign-item">
                    <div className="campaign-item-header">
                      <span className="campaign-name">{c.name}</span>
                      <span className="campaign-pct" style={{ color: "#0EA5E9" }}>{pct}%</span>
                    </div>
                    <div className="campaign-bar-bg">
                      <div className="campaign-bar-fill" style={{ width: `${pct}%`, background: "#0EA5E9" }} />
                    </div>
                    <div className="campaign-amounts">
                      <span>Rs.{(c.raised || 0).toLocaleString("en-IN")} raised</span>
                      <span className="text-muted">Goal: Rs.{(c.target || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dash-card dash-card-sm">
          <h5 className="dash-card-title mb-4">Approved Funding</h5>
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : approvedRequests.length === 0 ? (
            <p className="text-muted text-center py-4">
              No approved funds yet.<br />
              <Link to="/user/funding" className="auth-link">Submit funding request</Link>
            </p>
          ) : (
            <div className="activity-list">
              {approvedRequests.slice(0, 5).map((r) => (
                <div key={r._id} className="activity-item">
                  <span className="activity-icon">Rs</span>
                  <div>
                    <p className="activity-text">Rs.{r.amount?.toLocaleString("en-IN")} approved</p>
                    <small className="activity-time">{r.title} - {new Date(r.updatedAt || r.createdAt).toLocaleDateString("en-IN")}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
