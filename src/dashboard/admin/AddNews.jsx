import React, { useState } from "react";
import { Plus, Trash2, Edit2, Newspaper } from "lucide-react";
import PageHeader from "../../Components/PageHeader";

const INITIAL_NEWS = [
  { id: 1, title: "Clean Water Campaign Reaches 80% Goal", category: "Campaign", date: "2026-05-10", status: "published" },
  { id: 2, title: "Annual Charity Gala — Save the Date",   category: "Event",    date: "2026-05-08", status: "published" },
  { id: 3, title: "New Education Drive Launched in Bihar", category: "News",     date: "2026-05-05", status: "draft"     },
  { id: 4, title: "Volunteer Spotlight: Meet Priya",       category: "Story",    date: "2026-05-01", status: "published" },
];

const AddNews = () => {
  const [items, setItems] = useState(INITIAL_NEWS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "News", content: "", status: "draft" });
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now(), ...form, date: new Date().toISOString().split("T")[0] };
    setItems([newItem, ...items]);
    setForm({ title: "", category: "News", content: "", status: "draft" });
    setShowForm(false);
    setSuccess("Article published successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = (id) => setItems(items.filter((i) => i.id !== id));

  return (
    <div>
      <PageHeader
        title="News & Events"
        subtitle={`${items.length} articles`}
        action={
          <button className="dash-btn dash-btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} className="me-2" /> {showForm ? "Cancel" : "Add Article"}
          </button>
        }
      />

      {success && (
        <div className="auth-alert auth-alert-success mb-4 animate-fade-in-up">
          <i className="bi bi-check-circle-fill me-2" />{success}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="dash-card mb-4 animate-fade-in-up">
          <h5 className="dash-card-title mb-4">New Article</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Title</label>
                <input type="text" className="dash-input" placeholder="Article title..." value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Category</label>
                <select className="dash-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {["News", "Event", "Campaign", "Story"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Status</label>
                <select className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Content</label>
                <textarea className="dash-input" rows={4} placeholder="Write article content..." value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })} required />
              </div>
              <div className="col-12">
                <button type="submit" className="dash-btn dash-btn-primary">Publish Article</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Articles list */}
      <div className="dash-card">
        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold">{item.title}</td>
                  <td><span className="campaign-tag">{item.category}</span></td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`status-pill ${item.status === "published" ? "status-completed" : "status-pending"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn action-edit"><Edit2 size={15} /></button>
                      <button className="action-btn action-delete" onClick={() => handleDelete(item.id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <div className="empty-state"><Newspaper size={40} /><p>No articles yet</p></div>}
      </div>
    </div>
  );
};

export default AddNews;
