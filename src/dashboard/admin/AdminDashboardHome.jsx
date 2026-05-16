import React, { useEffect, useState } from "react";
import { DollarSign, Users, HeartHandshake, MessageSquare, TrendingUp, Download, Eye } from "lucide-react";
import StatCard from "../../Components/StatCard";
import MiniChart from "../../Components/MiniChart";
import PageHeader from "../../Components/PageHeader";

import API from "../../config/api";

const AdminDashboardHome = () => {
  const [donations,  setDonations]  = useState([]);
  const [users,      setUsers]      = useState([]);
  const [campaigns,  setCampaigns]  = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const h = token ? { Authorization: `Bearer ${token}` } : {};
    const asArray = async (res) => {
      try {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    };
    Promise.all([
      fetch(`${API}/donations`).then(asArray),
      fetch(`${API}/users`, { headers: h }).then((r) => (r.ok ? asArray(r) : [])),
      fetch(`${API}/campaigns`).then(asArray),
      fetch(`${API}/contact`).then(asArray),
    ])
      .then(([don, usr, camp, msg]) => {
        setDonations(don);
        setUsers(usr);
        setCampaigns(camp);
        setMessages(msg);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalDonations = donations.reduce((s, d) => s + (d.amount || 0), 0);

  // Monthly chart
  const monthlyData = Array(12).fill(0);
  donations.forEach((d) => {
    const m = new Date(d.createdAt).getMonth();
    monthlyData[m] += d.amount || 0;
  });

  const downloadCSV = () => {
    const rows = [["Transaction ID","Name","Email","Amount","Method","Status","Date"]];
    donations.forEach((d) => rows.push([d.transactionId, d.name, d.email, d.amount, d.method, d.status, new Date(d.createdAt).toLocaleDateString("en-IN")]));
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "donations_report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back, Admin 👋"
        action={
          <button className="dash-btn dash-btn-primary" onClick={downloadCSV}>
            <Download size={16} className="me-2" />Export Report
          </button>
        }
      />

      <div className="stats-grid">
        <StatCard icon={<DollarSign size={24} />}    title="Total Donations"   value={`₹${totalDonations.toLocaleString("en-IN")}`} trend={`${donations.length} transactions`}  trendUp color="#0EA5E9" delay={0} />
        <StatCard icon={<Users size={24} />}          title="Registered Users"  value={users.length}      trend="All roles"          trendUp color="#7C3AED" delay={100} />
        <StatCard icon={<HeartHandshake size={24} />} title="Active Campaigns"  value={campaigns.length}  trend="Running now"        trendUp color="#10B981" delay={200} />
        <StatCard icon={<MessageSquare size={24} />}  title="Messages"          value={messages.length}   trend="Contact form"       trendUp color="#F59E0B" delay={300} />
      </div>

      {/* Chart + Campaigns */}
      <div className="dash-row mt-4">
        <div className="dash-card dash-card-lg">
          <div className="dash-card-header">
            <div>
              <h5 className="dash-card-title">Donation Trend</h5>
              <p className="dash-card-sub">Monthly overview</p>
            </div>
            {totalDonations > 0 && <span className="dash-badge-green"><TrendingUp size={14} className="me-1" />Live Data</span>}
          </div>
          <div className="chart-labels">
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => <span key={m}>{m}</span>)}
          </div>
          <MiniChart data={monthlyData} color="#0EA5E9" height={80} />
          <div className="chart-summary">
            <div><strong>₹{totalDonations.toLocaleString("en-IN")}</strong><span>Total Raised</span></div>
            <div><strong>{donations.length}</strong><span>Donations</span></div>
            <div><strong>₹{donations.length > 0 ? Math.round(totalDonations / donations.length).toLocaleString("en-IN") : 0}</strong><span>Avg. Donation</span></div>
          </div>
        </div>

        <div className="dash-card dash-card-sm">
          <div className="dash-card-header"><h5 className="dash-card-title">Campaign Progress</h5></div>
          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
          ) : (
            <div className="campaign-list">
              {campaigns.slice(0, 4).map((c, i) => {
                const pct    = c.target > 0 ? Math.min(100, Math.round((c.raised / c.target) * 100)) : 0;
                const colors = ["#0EA5E9","#7C3AED","#10B981","#F59E0B"];
                const color  = colors[i % colors.length];
                return (
                  <div key={c._id} className="campaign-item">
                    <div className="campaign-item-header">
                      <span className="campaign-name">{c.name}</span>
                      <span className="campaign-pct" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="campaign-bar-bg">
                      <div className="campaign-bar-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <div className="campaign-amounts">
                      <span>₹{(c.raised || 0).toLocaleString("en-IN")}</span>
                      <span className="text-muted">of ₹{(c.target || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                );
              })}
              {campaigns.length === 0 && <p className="text-muted text-center py-3">No campaigns yet.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="dash-card mt-4">
        <div className="dash-card-header">
          <h5 className="dash-card-title">Recent Transactions</h5>
          <button className="dash-btn dash-btn-outline"><Eye size={14} className="me-1" />View All</button>
        </div>
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr><th>Transaction ID</th><th>Donor</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {donations.slice(0, 6).map((d) => (
                  <tr key={d._id}>
                    <td className="fw-semibold" style={{ color: "#0EA5E9" }}>{d.transactionId}</td>
                    <td>
                      <div className="table-user">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&size=32&background=random`} alt={d.name} />
                        <div><p>{d.name}</p><small>{d.email}</small></div>
                      </div>
                    </td>
                    <td className="fw-bold">₹{d.amount?.toLocaleString("en-IN")}</td>
                    <td>{d.method}</td>
                    <td>{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                    <td><span className={`status-pill status-${(d.status || "completed").toLowerCase()}`}>{d.status || "Completed"}</span></td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-4">No donations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardHome;
