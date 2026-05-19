import React, { useEffect, useState } from "react";
import { Download, CreditCard } from "lucide-react";
import PageHeader from "../../Components/PageHeader";
import { Link } from "react-router-dom";

import { API_BASE_URL as API } from "../../config/api";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/donations/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? payments : payments.filter((p) => (p.status || "Completed").toLowerCase() === filter);
  const total    = filtered.filter((p) => (p.status || "Completed").toLowerCase() === "completed").reduce((s, p) => s + (p.amount || 0), 0);

  const downloadCSV = () => {
    const rows = [["Transaction ID","Amount","Method","Frequency","Date","Status"]];
    filtered.forEach((p) => rows.push([p.transactionId, p.amount, p.method, p.frequency || "One Time", new Date(p.createdAt).toLocaleDateString("en-IN"), p.status || "Completed"]));
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "my_donations.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Payment History"
        subtitle={`${filtered.length} records · ₹${total.toLocaleString("en-IN")} completed`}
        action={
          <button className="dash-btn dash-btn-primary" onClick={downloadCSV}>
            <Download size={16} className="me-2" />Export CSV
          </button>
        }
      />

      <div className="dash-card mb-4">
        <div className="dash-filters">
          <div className="dash-filter-tabs">
            {["all", "completed", "pending", "failed"].map((s) => (
              <button key={s} className={`filter-tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-success" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={40} />
            <p>No payments found.</p>
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
                  <th>Frequency</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td className="fw-semibold" style={{ color: "#10B981" }}>{p.transactionId}</td>
                    <td className="fw-bold">₹{p.amount?.toLocaleString("en-IN")}</td>
                    <td>{p.method}</td>
                    <td>{p.frequency || "One Time"}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                    <td><span className={`status-pill status-${(p.status || "completed").toLowerCase()}`}>{p.status || "Completed"}</span></td>
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

export default PaymentHistory;
