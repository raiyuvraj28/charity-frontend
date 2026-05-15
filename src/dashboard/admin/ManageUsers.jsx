import React, { useState } from "react";
import { Search, UserPlus, Edit2, Trash2, Shield, User, Heart } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

const USERS = [
  { id: 1, name: "Alice Johnson",  email: "alice@mail.com",  role: "user",  status: "active",   joined: "2026-01-15", donations: 3 },
  { id: 2, name: "Bob Williams",   email: "bob@mail.com",    role: "donor", status: "active",   joined: "2026-02-20", donations: 12 },
  { id: 3, name: "Carol Davis",    email: "carol@mail.com",  role: "user",  status: "inactive", joined: "2026-03-05", donations: 0 },
  { id: 4, name: "David Brown",    email: "david@mail.com",  role: "donor", status: "active",   joined: "2026-03-18", donations: 7 },
  { id: 5, name: "Eva Martinez",   email: "eva@mail.com",    role: "admin", status: "active",   joined: "2025-12-01", donations: 0 },
  { id: 6, name: "Frank Wilson",   email: "frank@mail.com",  role: "user",  status: "active",   joined: "2026-04-10", donations: 2 },
  { id: 7, name: "Grace Lee",      email: "grace@mail.com",  role: "donor", status: "active",   joined: "2026-04-22", donations: 18 },
  { id: 8, name: "Henry Taylor",   email: "henry@mail.com",  role: "user",  status: "inactive", joined: "2026-05-01", donations: 1 },
];

const roleIcon = { admin: <Shield size={14} />, user: <User size={14} />, donor: <Heart size={14} /> };
const roleColor = { admin: "#7C3AED", user: "#0EA5E9", donor: "#10B981" };

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <PageHeader
        title="Manage Users"
        subtitle={`${USERS.length} total users`}
        action={
          <button className="dash-btn dash-btn-primary">
            <UserPlus size={16} className="me-2" /> Add User
          </button>
        }
      />

      {/* Filters */}
      <div className="dash-card mb-4">
        <div className="dash-filters">
          <div className="dash-search-input">
            <Search size={16} />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="dash-filter-tabs">
            {["all", "user", "admin", "donor"].map((f) => (
              <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Donations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="table-user">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=36&background=random`} alt={u.name} />
                      <div>
                        <p>{u.name}</p>
                        <small>{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="role-pill" style={{ background: `${roleColor[u.role]}18`, color: roleColor[u.role] }}>
                      {roleIcon[u.role]} <span className="ms-1 text-capitalize">{u.role}</span>
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${u.status === "active" ? "status-completed" : "status-failed"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.joined}</td>
                  <td><span className="fw-semibold">{u.donations}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn action-edit"><Edit2 size={15} /></button>
                      <button className="action-btn action-delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <User size={40} />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
