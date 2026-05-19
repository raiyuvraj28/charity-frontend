import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard, Users, HeartHandshake, Settings, LogOut,
  TrendingUp, DollarSign, Search, Bell, X, Download,
  MessageSquare, Reply, CheckCircle, Clock,
  Newspaper, HandCoins, Eye, XCircle, Menu
} from "lucide-react";

import { API_BASE_URL as API } from "../config/api";

const parseJsonArray = async (res) => {
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab]               = useState("dashboard");
  const [transactions, setTransactions]         = useState([]);
  const [volunteers,   setVolunteers]           = useState([]);
  const [campaigns,    setCampaigns]            = useState([]);
  const [messages,     setMessages]             = useState([]);
  const [funding,      setFunding]              = useState([]);
  const [newsItems,    setNewsItems]            = useState([]);
  const [showNotif,    setShowNotif]            = useState(false);
  const [sidebarOpen,  setSidebarOpen]          = useState(false);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const fetchGenRef = useRef(0);

  // reply state
  const [replyText,    setReplyText]            = useState({});
  const [replySending, setReplySending]         = useState({});
  const [replyDone,    setReplyDone]            = useState({});

  // funding action state
  const [fundNote,     setFundNote]             = useState({});
  const [fundLoading,  setFundLoading]          = useState({});
  const [fundError,    setFundError]            = useState({});

  // news form
  const [newsForm,     setNewsForm]             = useState({ title:"", description:"", date:"", imageUrl:"", published:true });
  const [newsEdit,     setNewsEdit]             = useState(null);
  const [newsMsg,      setNewsMsg]              = useState("");

  // photo preview modal
  const [photoModal,   setPhotoModal]           = useState(null);
  const [adminForm,    setAdminForm]            = useState({ name: "Super Admin", email: "admin@hopeandhelp.org", phone: "", org: "Hope & Help Foundation" });
  const [adminSaved,   setAdminSaved]           = useState(false);
  const [adminError,   setAdminError]           = useState("");
  const [adminSaving,  setAdminSaving]          = useState(false);

  const loadDonations = useCallback(async () => {
    try {
      const res = await fetch(`${API}/donations`);
      const data = await parseJsonArray(res);
      setTransactions(data);
    } catch { /* keep last known list */ }
  }, []);

  const fetchAll = useCallback(async () => {
    const gen = ++fetchGenRef.current;
    setDonationsLoading(true);
    try {
      const [don, vol, camp, msg, fund, news] = await Promise.all([
        fetch(`${API}/donations`).then(parseJsonArray),
        fetch(`${API}/volunteers`).then(parseJsonArray),
        fetch(`${API}/campaigns`).then(parseJsonArray),
        fetch(`${API}/contact`).then(parseJsonArray),
        fetch(`${API}/funding`).then(parseJsonArray),
        fetch(`${API}/news/all`).then(parseJsonArray),
      ]);
      if (gen !== fetchGenRef.current) return;
      setTransactions(don);
      setVolunteers(vol);
      setCampaigns(camp);
      setMessages(msg);
      setFunding(fund);
      setNewsItems(news);
    } catch {
      if (gen === fetchGenRef.current) {
        setTransactions([]);
        setVolunteers([]);
        setCampaigns([]);
        setMessages([]);
        setFunding([]);
        setNewsItems([]);
      }
    } finally {
      if (gen === fetchGenRef.current) setDonationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(loadDonations, 15000);
    const onFocus = () => loadDonations();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchAll, loadDonations]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleAdminSave = async (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminSaving(true);
    try {
      const res = await fetch(`${API}/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAdminError(data.message || "Failed to save admin settings.");
      } else {
        setAdminForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          org: data.org || "Hope & Help Foundation"
        });
        localStorage.setItem("auth_user", JSON.stringify(data));
        setAdminSaved(true);
        setTimeout(() => setAdminSaved(false), 3000);
      }
    } catch {
      setAdminError("Cannot connect to server.");
    }
    setAdminSaving(false);
  };

  //  Reply to message 
  const handleReply = async (id) => {
    const text = (replyText[id] || "").trim();
    if (!text) return;
    setReplySending(s => ({...s, [id]: true}));
    try {
      const res = await fetch(`${API}/contact/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText: text })
      });
      if (res.ok) {
        setReplyDone(s => ({...s, [id]: true}));
        setReplyText(s => ({...s, [id]: ""}));
        fetchAll();
        setTimeout(() => setReplyDone(s => ({...s, [id]: false})), 4000);
      }
    } catch {}
    setReplySending(s => ({...s, [id]: false}));
  };

  //  Approve / Reject funding 
  const handleFunding = async (id, status) => {
    setFundError(s => ({ ...s, [id]: "" }));
    setFundLoading(s => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`${API}/funding/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: fundNote[id] || "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFundError(s => ({ ...s, [id]: data.message || "Could not update request." }));
        return;
      }
      setFundNote(s => ({ ...s, [id]: "" }));
      fetchAll();
    } catch {
      setFundError(s => ({ ...s, [id]: "Cannot connect to server." }));
    } finally {
      setFundLoading(s => ({ ...s, [id]: false }));
    }
  };

  //  News CRUD 
  const handleNewsSave = async () => {
    if (!newsForm.title || !newsForm.description) { setNewsMsg("Title and description required."); return; }
    const url    = newsEdit ? `${API}/news/${newsEdit}` : `${API}/news`;
    const method = newsEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(newsForm) });
    if (res.ok) {
      setNewsMsg(newsEdit ? "Updated!" : "Published!");
      setNewsForm({ title:"", description:"", date:"", imageUrl:"", published:true });
      setNewsEdit(null);
      fetchAll();
      setTimeout(() => setNewsMsg(""), 3000);
    }
  };

  const handleNewsEdit = (item) => {
    setNewsEdit(item._id);
    setNewsForm({ title: item.title, description: item.description, date: item.date, imageUrl: item.imageUrl, published: item.published });
  };

  const handleNewsDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    await fetch(`${API}/news/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const handleNewsToggle = async (item) => {
    await fetch(`${API}/news/${item._id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ published: !item.published })
    });
    fetchAll();
  };

  //  CSV 
  const downloadCSV = (data, headers, filename) => {
    const rows = [headers.join(","), ...data.map(r => headers.map(h => `"${String(r[h]??"")}"`).join(","))];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.join("\n")], {type:"text/csv"}));
    a.download = filename; a.click();
  };

  //  Computed 
  const completedDonations = transactions.filter(
    (t) => !t.status || String(t.status).toLowerCase() === "completed"
  );
  const totalDonations  = completedDonations.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const approvedFunding = funding.filter(f => f.status === "approved").reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const availableFund   = Math.max(0, totalDonations - approvedFunding);
  const unreadMessages  = messages.filter(m => !m.replied).length;
  const pendingFunding  = funding.filter(f => f.status === "pending").length;

  const notifications = [
    ...messages.filter(m=>!m.replied).slice(0,3).map(m=>({ id:m._id, icon:"", text:`New message from ${m.firstName} ${m.lastName}`, time: new Date(m.createdAt).toLocaleString() })),
    ...funding.filter(f=>f.status==="pending").slice(0,3).map(f=>({ id:f._id, icon:"", text:`Funding request: "${f.title}" by ${f.userName}`, time: new Date(f.createdAt).toLocaleString() })),
    ...transactions.slice(0,2).map(t=>({ id:t._id, icon:"", text:`${t.name} donated ₹${t.amount?.toLocaleString("en-IN")}`, time: new Date(t.createdAt).toLocaleString() })),
  ].sort((a,b)=>new Date(b.time)-new Date(a.time)).slice(0,8);

  const statusBadge = (s) => {
    const map = { pending:"status-pending", approved:"status-completed", rejected:"status-failed", Completed:"status-completed", Active:"status-completed" };
    return <span className={`status-badge ${map[s]||"status-pending"}`}>{s}</span>;
  };

  // 
  //  RENDER VIEWS
  // 

  const renderDashboard = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Overview</h2>
        <button className="btn-premium btn-primary py-2 px-4" style={{fontSize:"0.9rem"}}
          onClick={()=>downloadCSV(transactions.map(t=>({ID:t.transactionId,Name:t.name,Email:t.email,Amount:t.amount,Method:t.method,Status:t.status,Date:new Date(t.createdAt).toLocaleDateString()})),["ID","Name","Email","Amount","Method","Status","Date"],"donations.csv")}>
          <Download size={16} className="me-2"/>Download Report
        </button>
      </div>
      <div className="row mb-4 g-3">
        {[ 
          {icon:<DollarSign size={24}/>, title:"Remaining Donations", value:`₹${availableFund.toLocaleString("en-IN")}`, trend:`Received ₹${totalDonations.toLocaleString("en-IN")} − Approved ₹${approvedFunding.toLocaleString("en-IN")}`, cls:"bg-primary-light text-primary"},
          {icon:<HandCoins size={24}/>, title:"Total Received", value:`₹${totalDonations.toLocaleString("en-IN")}`, trend:`${completedDonations.length} donations`, cls:"bg-info-light text-info"},
          {icon:<HeartHandshake size={24}/>, title:"Campaigns", value:campaigns.length, trend:"Active programs", cls:"bg-success-light text-success"},
          {icon:<Users size={24}/>, title:"Volunteers", value:volunteers.length, trend:"Registered", cls:"bg-warning-light text-warning"},
          {icon:<MessageSquare size={24}/>, title:"Unread Messages", value:unreadMessages, trend:"Contact form", cls:"bg-info-light text-info"},
          {icon:<HandCoins size={24}/>, title:"Approved Funding", value:`₹${approvedFunding.toLocaleString("en-IN")}`, trend:`${pendingFunding} pending`, cls:"bg-success-light text-success"},
        ].map((c,i)=>(
          <div className="col-lg-2 col-md-4 col-6" key={i}>
            <div className="metric-card">
              <div className={`metric-icon ${c.cls}`}>{c.icon}</div>
              <div>
                <p className="metric-title">{c.title}</p>
                <h3 className="metric-value">{c.value}</h3>
                <p className="metric-trend text-success"><TrendingUp size={12}/> {c.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="data-table-container">
        <div className="table-header">
          <h4 className="mb-0 fw-bold">Recent Transactions</h4>
          <button className="btn btn-outline-secondary btn-sm" onClick={()=>setActiveTab("transactions")}>View All</button>
        </div>
        <div className="table-responsive">
          <table className="custom-table">
            <thead><tr><th>ID</th><th>Donor</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {donationsLoading && !transactions.length ? (
                <tr><td colSpan={6} className="text-center text-muted py-4"><span className="spinner-border spinner-border-sm me-2" />Loading donations...</td></tr>
              ) : transactions.slice(0,5).map(t=>(
                <tr key={t._id}>
                  <td className="fw-medium text-primary">{t.transactionId}</td>
                  <td><div className="fw-bold">{t.name}</div><small className="text-muted">{t.email}</small></td>
                  <td className="fw-bold">₹{t.amount?.toLocaleString("en-IN")}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>{t.method}</td>
                  <td>{statusBadge(t.status)}</td>
                </tr>
              ))}
              {!donationsLoading && !transactions.length && <tr><td colSpan={6} className="text-center text-muted py-4">No transactions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderMessages = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold">Contact Messages</h2>
          <small className="text-muted">{unreadMessages} unread  {messages.length} total</small>
        </div>
      </div>
      {messages.length === 0
        ? <div className="data-table-container p-5 text-center text-muted"><MessageSquare size={48} className="mb-3 opacity-50"/><p>No messages yet.</p></div>
        : <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            {messages.map(msg=>(
              <div key={msg._id} className="data-table-container p-4"
                style={{borderLeft: msg.replied?"4px solid #10B981":"4px solid #F59E0B"}}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="fw-bold mb-1">{msg.firstName} {msg.lastName}</h5>
                    <a href={`mailto:${msg.email}`} className="text-primary" style={{fontSize:"0.88rem"}}>{msg.email}</a>
                    <p className="text-muted mb-0" style={{fontSize:"0.78rem"}}>{new Date(msg.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`status-badge ${msg.replied?"status-completed":"status-pending"}`} style={{display:"flex",alignItems:"center",gap:"4px"}}>
                    {msg.replied ? <><CheckCircle size={13}/> Replied</> : <><Clock size={13}/> Pending</>}
                  </span>
                </div>
                <div style={{background:"#f8fafc",borderRadius:"10px",padding:"14px 16px",margin:"10px 0",fontSize:"0.92rem",color:"#1e293b"}}>
                  {msg.message}
                </div>
                {msg.replied && msg.replyText && (
                  <div style={{background:"#ecfdf5",borderRadius:"10px",padding:"12px 16px",marginBottom:"10px",fontSize:"0.88rem",borderLeft:"3px solid #10B981"}}>
                    <strong style={{color:"#065f46",fontSize:"0.75rem",textTransform:"uppercase"}}>Your Reply</strong>
                    <p style={{margin:"6px 0 0"}}>{msg.replyText}</p>
                    <small className="text-muted">{msg.repliedAt ? new Date(msg.repliedAt).toLocaleString("en-IN") : ""}</small>
                  </div>
                )}
                {replyDone[msg._id]
                  ? <div style={{background:"#ecfdf5",borderRadius:"10px",padding:"12px 16px",color:"#065f46",fontSize:"0.88rem",display:"flex",alignItems:"center",gap:"8px"}}>
                      <CheckCircle size={16}/> Reply sent! Email delivered to {msg.email}
                    </div>
                  : <div style={{display:"flex",gap:"10px",alignItems:"flex-end"}}>
                      <textarea rows={2} placeholder={msg.replied?"Send another reply...":"Type your reply..."}
                        value={replyText[msg._id]||""}
                        onChange={e=>setReplyText(s=>({...s,[msg._id]:e.target.value}))}
                        style={{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"10px 14px",fontSize:"0.88rem",resize:"none",outline:"none"}}
                        onFocus={e=>e.target.style.borderColor="#0EA5E9"}
                        onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                      />
                      <button onClick={()=>handleReply(msg._id)}
                        disabled={replySending[msg._id]||!replyText[msg._id]?.trim()}
                        style={{background:"#0EA5E9",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 20px",fontWeight:600,fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",opacity:!replyText[msg._id]?.trim()?0.5:1}}>
                        {replySending[msg._id]?<span className="spinner-border spinner-border-sm"/>:<Reply size={16}/>}
                        {replySending[msg._id]?"Sending...":"Send Reply"}
                      </button>
                    </div>
                }
              </div>
            ))}
          </div>
      }
    </>
  );

  const renderFunding = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold">Funding Requests</h2>
          <small className="text-muted">{pendingFunding} pending  {funding.length} total</small>
        </div>
      </div>
      {funding.length === 0
        ? <div className="data-table-container p-5 text-center text-muted"><HandCoins size={48} className="mb-3 opacity-50"/><p>No funding requests yet.</p></div>
        : <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            {funding.map(fr=>(
              <div key={fr._id} className="data-table-container p-4"
                style={{borderLeft: fr.status==="approved"?"4px solid #10B981":fr.status==="rejected"?"4px solid #ef4444":"4px solid #F59E0B"}}>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">{fr.title}</h5>
                    <p className="mb-0" style={{fontSize:"0.88rem"}}><strong>{fr.userName}</strong>  <a href={`mailto:${fr.userEmail}`} className="text-primary">{fr.userEmail}</a></p>
                    <p className="text-muted mb-0" style={{fontSize:"0.78rem"}}>{new Date(fr.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold" style={{fontSize:"1.2rem",color:"#0EA5E9"}}>₹{fr.amount?.toLocaleString("en-IN")}</span>
                    {statusBadge(fr.status)}
                  </div>
                </div>

                <p style={{background:"#f8fafc",borderRadius:"10px",padding:"12px 16px",fontSize:"0.9rem",color:"#1e293b",margin:"0 0 12px"}}>{fr.description}</p>

                {fr.photoUrl && (
                  <div className="mb-3">
                    <img src={fr.photoUrl} alt="Request photo"
                      style={{maxHeight:"180px",maxWidth:"100%",borderRadius:"10px",objectFit:"cover",cursor:"pointer",border:"2px solid #e2e8f0"}}
                      onClick={()=>setPhotoModal(fr.photoUrl)}/>
                    <small className="text-muted d-block mt-1">Click photo to enlarge</small>
                  </div>
                )}

                {fr.status === "pending" && (
                  <>
                  <p className="text-muted mb-2" style={{fontSize:"0.82rem"}}>
                    Remaining from donations: <strong>₹{availableFund.toLocaleString("en-IN")}</strong>
                    {Number(fr.amount) > availableFund && (
                      <span className="text-danger ms-2">— Request exceeds available balance</span>
                    )}
                  </p>
                  <div style={{display:"flex",gap:"10px",alignItems:"flex-end",flexWrap:"wrap"}}>
                    <textarea rows={2} placeholder="Optional custom message. If empty, user gets: request approved — please send bank account details."
                      value={fundNote[fr._id]||""}
                      onChange={e=>setFundNote(s=>({...s,[fr._id]:e.target.value}))}
                      style={{flex:1,minWidth:"200px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"10px 14px",fontSize:"0.88rem",resize:"none",outline:"none"}}
                      onFocus={e=>e.target.style.borderColor="#0EA5E9"}
                      onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                    />
                    <div style={{display:"flex",gap:"8px"}}>
                      <button onClick={()=>handleFunding(fr._id,"approved")} disabled={fundLoading[fr._id] || Number(fr.amount) > availableFund}
                        style={{background:"#10B981",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 18px",fontWeight:600,fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",opacity:(fundLoading[fr._id] || Number(fr.amount) > availableFund)?0.5:1}}>
                        {fundLoading[fr._id]?<span className="spinner-border spinner-border-sm"/>:<CheckCircle size={16}/>} Approve
                      </button>
                      <button onClick={()=>handleFunding(fr._id,"rejected")} disabled={fundLoading[fr._id]}
                        style={{background:"#ef4444",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 18px",fontWeight:600,fontSize:"0.88rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>
                        {fundLoading[fr._id]?<span className="spinner-border spinner-border-sm"/>:<XCircle size={16}/>} Reject
                      </button>
                    </div>
                  </div>
                  {fundError[fr._id] && (
                    <div className="alert alert-danger py-2 mt-2 mb-0" style={{fontSize:"0.85rem"}}>{fundError[fr._id]}</div>
                  )}
                  </>
                )}

                {fr.status !== "pending" && fr.userMessage && (
                  <div style={{background: fr.status==="approved"?"#ecfdf5":"#fef2f2",borderRadius:"10px",padding:"12px 16px",fontSize:"0.88rem",borderLeft:`3px solid ${fr.status==="approved"?"#10B981":"#ef4444"}`}}>
                    <strong>Sent to user:</strong> {fr.userMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </>
  );

  const renderNews = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold">News Management</h2>
          <small className="text-muted">{newsItems.length} articles</small>
        </div>
      </div>

      {/* Add / Edit form */}
      <div className="data-table-container p-4 mb-4">
        <h5 className="fw-bold mb-3">{newsEdit ? "Edit Article" : "Add New Article"}</h5>
        {newsMsg && <div className={`alert ${newsMsg.includes("!")||newsMsg.includes("Updated")||newsMsg.includes("Published")?"alert-success":"alert-danger"} py-2`}>{newsMsg}</div>}
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label fw-semibold" style={{fontSize:"0.82rem"}}>Title *</label>
            <input className="form-control" placeholder="Article title..." value={newsForm.title}
              onChange={e=>setNewsForm(f=>({...f,title:e.target.value}))}/>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold" style={{fontSize:"0.82rem"}}>Date</label>
            <input className="form-control" placeholder="e.g. May 12, 2026" value={newsForm.date}
              onChange={e=>setNewsForm(f=>({...f,date:e.target.value}))}/>
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold" style={{fontSize:"0.82rem"}}>Description *</label>
            <textarea className="form-control" rows={3} placeholder="Article content..." value={newsForm.description}
              onChange={e=>setNewsForm(f=>({...f,description:e.target.value}))}/>
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold" style={{fontSize:"0.82rem"}}>Image URL</label>
            <input className="form-control" placeholder="https://... or /images/news/photo.jpg" value={newsForm.imageUrl}
              onChange={e=>setNewsForm(f=>({...f,imageUrl:e.target.value}))}/>
          </div>
          <div className="col-md-4 d-flex align-items-end gap-2">
            <button className="btn btn-primary px-4" onClick={handleNewsSave}>
              {newsEdit ? "Update" : "Publish"}
            </button>
            {newsEdit && (
              <button className="btn btn-outline-secondary" onClick={()=>{setNewsEdit(null);setNewsForm({title:"",description:"",date:"",imageUrl:"",published:true});}}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Articles list */}
      <div className="data-table-container">
        <div className="table-responsive">
          <table className="custom-table">
            <thead><tr><th>Image</th><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {newsItems.map(item=>(
                <tr key={item._id}>
                  <td>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.title} style={{width:"60px",height:"40px",objectFit:"cover",borderRadius:"6px"}}
                          onError={e=>e.target.style.display="none"}/>
                      : <span className="text-muted" style={{fontSize:"0.8rem"}}>No image</span>}
                  </td>
                  <td className="fw-semibold" style={{maxWidth:"260px"}}>{item.title}</td>
                  <td>{item.date}</td>
                  <td>
                    <button onClick={()=>handleNewsToggle(item)}
                      style={{background:item.published?"#ecfdf5":"#f1f5f9",color:item.published?"#065f46":"#64748b",border:"none",borderRadius:"8px",padding:"4px 12px",fontSize:"0.78rem",fontWeight:700,cursor:"pointer"}}>
                      {item.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td>
                    <div style={{display:"flex",gap:"6px"}}>
                      <button onClick={()=>handleNewsEdit(item)}
                        style={{background:"#eff6ff",color:"#2563eb",border:"none",borderRadius:"8px",padding:"6px 12px",fontSize:"0.82rem",cursor:"pointer"}}>
                        Edit
                      </button>
                      <button onClick={()=>handleNewsDelete(item._id)}
                        style={{background:"#fef2f2",color:"#ef4444",border:"none",borderRadius:"8px",padding:"6px 12px",fontSize:"0.82rem",cursor:"pointer"}}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!newsItems.length && <tr><td colSpan={5} className="text-center text-muted py-4">No articles yet. Add one above.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderTransactions = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">All Transactions</h2>
        <button className="btn btn-outline-primary"
          onClick={()=>downloadCSV(transactions.map(t=>({ID:t.transactionId,Name:t.name,Email:t.email,Amount:t.amount,Method:t.method,Status:t.status,Date:new Date(t.createdAt).toLocaleDateString()})),["ID","Name","Email","Amount","Method","Status","Date"],"donations.csv")}>
          <Download size={16} className="me-2"/>Export CSV
        </button>
      </div>
      <div className="data-table-container">
        <div className="table-responsive">
          <table className="custom-table">
            <thead><tr><th>ID</th><th>Donor</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {donationsLoading && !transactions.length ? (
                <tr><td colSpan={6} className="text-center text-muted py-4"><span className="spinner-border spinner-border-sm me-2" />Loading donations...</td></tr>
              ) : transactions.map(t=>(
                <tr key={t._id}>
                  <td className="fw-medium text-primary">{t.transactionId}</td>
                  <td><div className="fw-bold">{t.name}</div><small className="text-muted">{t.email}</small></td>
                  <td className="fw-bold">₹{t.amount?.toLocaleString("en-IN")}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>{t.method}</td>
                  <td>{statusBadge(t.status)}</td>
                </tr>
              ))}
              {!donationsLoading && !transactions.length && <tr><td colSpan={6} className="text-center text-muted py-4">No transactions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderVolunteers = () => (
    <>
      <div className="mb-4"><h2 className="mb-0 fw-bold">Volunteers</h2></div>
      <div className="data-table-container">
        <div className="table-responsive">
          <table className="custom-table">
            <thead><tr><th>ID</th><th>Name / Email</th><th>Interest</th><th>Joined</th><th>Status</th></tr></thead>
            <tbody>
              {volunteers.map(v=>(
                <tr key={v._id}>
                  <td className="fw-medium text-primary">{v.volunteerId}</td>
                  <td><div className="fw-bold">{v.name}</div><small className="text-muted">{v.email}</small></td>
                  <td>{v.interest}</td>
                  <td>{new Date(v.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>{statusBadge(v.status)}</td>
                </tr>
              ))}
              {!volunteers.length && <tr><td colSpan={5} className="text-center text-muted py-4">No volunteers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderCampaigns = () => (
    <>
      <div className="mb-4"><h2 className="mb-0 fw-bold">Active Campaigns</h2></div>
      <div className="data-table-container p-4">
        <div className="row g-4">
          {campaigns.map(c=>{
            const pct = c.target>0 ? Math.min(100,Math.round((c.raised/c.target)*100)) : 0;
            return (
              <div className="col-md-6" key={c._id}>
                <div className="border rounded p-4 h-100" style={{background:"#f8fafc"}}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{c.name}</h5>
                    {statusBadge(c.status)}
                  </div>
                  <p className="text-muted mb-3" style={{fontSize:"0.85rem"}}>{c.category}</p>
                  <div className="d-flex justify-content-between mb-1" style={{fontSize:"0.85rem",fontWeight:600}}>
                    <span>₹{c.raised?.toLocaleString("en-IN")} Raised</span>
                    <span className="text-muted">Target: ₹{c.target?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="progress" style={{height:"8px",borderRadius:"10px"}}>
                    <div className="progress-bar" style={{width:`${pct}%`,background:"var(--accent)"}}/>
                  </div>
                </div>
              </div>
            );
          })}
          {!campaigns.length && <p className="text-muted text-center py-4">No campaigns yet.</p>}
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div className="mb-4"><h2 className="mb-0 fw-bold">Admin Settings</h2></div>
      <div className="data-table-container p-4">
        {adminSaved && <div className="alert alert-success py-2">Settings saved successfully!</div>}
        {adminError && <div className="alert alert-danger py-2">{adminError}</div>}
        <h5 className="fw-bold mb-4 border-bottom pb-3">Profile Information</h5>
        <form className="row" onSubmit={handleAdminSave}>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted fw-bold" style={{fontSize:"0.82rem"}}>Admin Name</label>
            <input type="text" className="form-control" value={adminForm.name} onChange={e=>setAdminForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted fw-bold" style={{fontSize:"0.82rem"}}>Email Address</label>
            <input type="email" className="form-control" value={adminForm.email} onChange={e=>setAdminForm(f=>({...f,email:e.target.value}))}/>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted fw-bold" style={{fontSize:"0.82rem"}}>Phone Number</label>
            <input type="text" className="form-control" value={adminForm.phone} onChange={e=>setAdminForm(f=>({...f,phone:e.target.value}))}/>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted fw-bold" style={{fontSize:"0.82rem"}}>Organization</label>
            <input type="text" className="form-control" value={adminForm.org} onChange={e=>setAdminForm(f=>({...f,org:e.target.value}))}/>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-3 px-4 py-2" disabled={adminSaving}>
              {adminSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  // 
  //  SIDEBAR NAV CONFIG
  // 
  const NAV = [
    { key:"dashboard",    icon:<LayoutDashboard size={20}/>, label:"Dashboard"         },
    { key:"transactions", icon:<DollarSign size={20}/>,      label:"Transactions"      },
    { key:"volunteers",   icon:<Users size={20}/>,           label:"Volunteers"        },
    { key:"campaigns",    icon:<HeartHandshake size={20}/>,  label:"Campaigns"         },
    { key:"messages",     icon:<MessageSquare size={20}/>,   label:"Messages",   badge: unreadMessages },
    { key:"funding",      icon:<HandCoins size={20}/>,       label:"Funding Requests", badge: pendingFunding },
    { key:"news",         icon:<Newspaper size={20}/>,       label:"News Manager"      },
  ];

  const closeSidebar = () => setSidebarOpen(false);
  const openTab = (key) => { setActiveTab(key); closeSidebar(); };

  return (
    <div className="admin-layout">

      {sidebarOpen && <div className="admin-overlay" onClick={closeSidebar} aria-hidden="true" />}

      {/* Photo Modal */}
      {photoModal && (
        <div onClick={()=>setPhotoModal(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <img src={photoModal} alt="Preview" style={{maxWidth:"90vw",maxHeight:"90vh",borderRadius:"12px",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}/>
          <button style={{position:"absolute",top:"20px",right:"20px",background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:"50%",width:"40px",height:"40px",fontSize:"1.2rem",cursor:"pointer"}}></button>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-logo">H&H</div>
          <div className="sidebar-brand-text">
            <h5 className="mb-0 text-white fw-bold">Admin Portal</h5>
            <small className="text-white-50">Hope & Help</small>
          </div>
          <button type="button" className="admin-sidebar-close" onClick={closeSidebar} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n=>(
            <button key={n.key} className={`nav-item ${activeTab===n.key?"active":""}`} onClick={()=>openTab(n.key)}>
              {n.icon} {n.label}
              {n.badge>0 && (
                <span style={{marginLeft:"auto",background:"#ef4444",color:"#fff",borderRadius:"50%",minWidth:"20px",height:"20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,padding:"0 4px"}}>
                  {n.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className={`nav-item ${activeTab==="settings"?"active":""}`} onClick={()=>openTab("settings")}>
            <Settings size={20}/> Settings
          </button>
          <button className="nav-item text-danger" onClick={handleLogout}>
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button type="button" className="admin-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="search-bar">
              <Search size={18} className="text-muted"/>
              <input type="text" placeholder="Search data..."/>
            </div>
          </div>
          <div className="header-actions">
            <div style={{position:"relative"}}>
              <button className="icon-btn" onClick={()=>setShowNotif(!showNotif)}>
                <Bell size={20}/>
                {notifications.length>0 && <span className="badge">{notifications.length}</span>}
              </button>
              {showNotif && (
                <div style={{position:"absolute",top:"50px",right:"0",width:"360px",maxHeight:"450px",background:"white",borderRadius:"12px",boxShadow:"0 10px 40px rgba(0,0,0,0.15)",zIndex:1000,overflow:"hidden",border:"1px solid #e2e8f0"}}>
                  <div style={{padding:"16px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h6 style={{margin:0,fontWeight:700}}>Notifications</h6>
                    <button onClick={()=>setShowNotif(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button>
                  </div>
                  <div style={{maxHeight:"360px",overflowY:"auto"}}>
                    {notifications.length===0
                      ? <div style={{padding:"30px 20px",textAlign:"center",color:"#94a3b8"}}>No notifications</div>
                      : notifications.map((n,i)=>(
                          <div key={n.id||i} style={{padding:"14px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",gap:"12px",alignItems:"flex-start",cursor:"pointer"}}
                            onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                            onMouseLeave={e=>e.currentTarget.style.background="white"}>
                            <span style={{fontSize:"1.3rem"}}>{n.icon}</span>
                            <div style={{flex:1}}>
                              <p style={{margin:0,fontSize:"0.88rem",fontWeight:500,color:"#1e293b"}}>{n.text}</p>
                              <small style={{color:"#94a3b8",fontSize:"0.75rem"}}>{n.time}</small>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                </div>
              )}
            </div>
            <div className="admin-profile">
              <img src="https://ui-avatars.com/api/?name=Admin&background=7C3AED&color=fff" alt="Admin"/>
              <div className="d-none d-md-block">
                <p className="mb-0 fw-bold" style={{fontSize:"0.85rem"}}>Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {activeTab==="dashboard"    && renderDashboard()}
          {activeTab==="transactions" && renderTransactions()}
          {activeTab==="volunteers"   && renderVolunteers()}
          {activeTab==="campaigns"    && renderCampaigns()}
          {activeTab==="messages"     && renderMessages()}
          {activeTab==="funding"      && renderFunding()}
          {activeTab==="news"         && renderNews()}
          {activeTab==="settings"     && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
