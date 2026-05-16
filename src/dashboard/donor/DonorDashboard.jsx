import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DollarSign, Target, TrendingUp, Award } from "lucide-react";
import StatCard from "../../Components/StatCard";
import MiniChart from "../../Components/MiniChart";
import PageHeader from "../../Components/PageHeader";
import { Link } from "react-router-dom";

import API from "../../config/api";

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${API}/donations/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : []),
      fetch(`${API}/campaigns`).then((r) => r.json()),
    ])
      .then(([don, camps]) => {
        setDonations(Array.isArray(don) ? don : []);
        setCampaigns(Array.isArray(camps) ? camps : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = donations.reduce((s, d) => s + (d.amount || 0), 0);
  const avg   = donations.length > 0 ? Math.round(total / donations.length) : 0;

  // Build monthly chart data from real donations
  const monthlyData = Array(12).fill(0);
  donations.forEach((d) => {
    const m = new Date(d.createdAt).getMonth();
    monthlyData[m] += d.amount || 0;
  });

  const rank = total > 50000 ? "Platinum" : total > 20000 ? "Gold" : total > 5000 ? "Silver" : "Bronze";

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0]} 💚`}
        subtitle="Your generosity is changing lives"
      />

      <div className="stats-grid">
        <StatCard icon={<DollarSign size={24} />} title="Total Donated"    value={`₹${total.toLocaleString("en-IN")}`}  trend={`${donations.length} payment${donations.length !== 1 ? "s" : ""}`} trendUp color="#10B981" delay={0} />
        <StatCard icon={<Target size={24} />}     title="Campaigns Backed" value={campaigns.length || "—"}               trend="Active campaigns"  trendUp color="#0EA5E9" delay={100} />
        <StatCard icon={<TrendingUp size={24} />} title="Avg. Donation"    value={`₹${avg.toLocaleString("en-IN")}`}     trend="Per transaction"  trendUp color="#7C3AED" delay={200} />
        <StatCard icon={<Award size={24} />}      title="Donor Rank"       value={rank}                                  trend="Based on total"   trendUp color="#F59E0B" delay={300} />
      </div>

      {/* Donation trend */}
      <div className="dash-card mt-4">
        <div className="dash-card-header">
          <div>
            <h5 className="dash-card-title">Donation Trend</h5>
            <p className="dash-card-sub">Your giving history — monthly breakdown</p>
          </div>
          {total > 0 && <span className="dash-badge-green"><TrendingUp size={14} className="me-1" />Active Donor</span>}
        </div>
        <div className="chart-labels">
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <MiniChart data={monthlyData} color="#10B981" height={80} />
        <div className="chart-summary">
          <div><strong>₹{total.toLocaleString("en-IN")}</strong><span>Total Given</span></div>
          <div><strong>{donations.length}</strong><span>Payments</span></div>
          <div><strong>₹{avg.toLocaleString("en-IN")}</strong><span>Avg. Donation</span></div>
        </div>
      </div>

      {/* Recent payments */}
      <div className="dash-card mt-4">
        <div className="dash-card-header">
          <h5 className="dash-card-title">Recent Payments</h5>
          <Link to="/donor/payments" className="dash-btn dash-btn-outline">View All</Link>
        </div>
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-success" /></div>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={40} />
            <p>No donations yet.</p>
            <Link to="/donate" className="dash-btn dash-btn-primary mt-3">Donate Now</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((d) => (
                  <tr key={d._id}>
                    <td className="fw-semibold" style={{ color: "#10B981" }}>{d.transactionId}</td>
                    <td className="fw-bold">₹{d.amount?.toLocaleString("en-IN")}</td>
                    <td>{d.method}</td>
                    <td>{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                    <td><span className={`status-pill status-${(d.status || "completed").toLowerCase()}`}>{d.status || "Completed"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
