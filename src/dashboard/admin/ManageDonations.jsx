import React, { useEffect, useState } from "react";
import { Download, Search, Filter } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

import { API_BASE_URL as API } from "../../config/api";

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/donations`);
        const data = await res.json();
        if (alive) setDonations(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setDonations([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = donations.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      (d.name || "").toLowerCase().includes(q) ||
      (d.transactionId || "").toLowerCase().includes(q) ||
      (d.email || "").toLowerCase().includes(q);
    const status = (d.status || "completed").toLowerCase();
    const matchStatus = statusFilter === "all" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = filtered.reduce((s, d) => s + (d.amount || 0), 0);

  const downloadCSV = () => {
    const rows = [["Transaction ID", "Name", "Email", "Amount", "Method", "Status", "Date"]];
    filtered.forEach((d) =>
      rows.push([
        d.transactionId,
        d.name,
        d.email,
        d.amount,
        d.method,
        d.status,
        new Date(d.createdAt).toLocaleDateString("en-IN"),
      ])
    );
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donations_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Manage Donations"
        subtitle={`${filtered.length} records · Total: ₹${total.toLocaleString("en-IN")}`}
        action={
          <button className="dash-btn dash-btn-primary" onClick={downloadCSV} disabled={!filtered.length}>
            <Download size={16} className="me-2" /> Export CSV
          </button>
        }
      />

      <div className="dash-card mb-4">
        <div className="dash-filters">
          <div className="dash-search-input">
            <Search size={16} />
            <input type="text" placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="dash-filter-tabs">
            {["all", "completed", "pending", "failed"].map((s) => (
              <button key={s} className={`filter-tab ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card">
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d._id}>
                    <td className="fw-semibold" style={{ color: "#7C3AED" }}>{d.transactionId}</td>
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
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && <div className="empty-state"><Filter size={40} /><p>No donations found</p></div>}
      </div>
    </div>
  );
};

export default ManageDonations;
