import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, Heart, Settings, LogOut, Bell, Search,
  Menu, X, TrendingUp, DollarSign, Newspaper, BarChart2, CreditCard,
  Target, UserCircle, ChevronDown, HandCoins
} from "lucide-react";

const NAV_CONFIG = {
  admin: {
    color: "#7C3AED",
    gradient: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
    label: "Admin Portal",
    links: [
      { to: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
      { to: "/admin/users",     icon: <Users size={20} />,           label: "Manage Users" },
      { to: "/admin/donations", icon: <DollarSign size={20} />,      label: "Manage Donations" },
      { to: "/admin/news",      icon: <Newspaper size={20} />,       label: "News & Events" },
      { to: "/admin/settings",  icon: <Settings size={20} />,        label: "Settings" },
    ],
  },
  user: {
    color: "#0EA5E9",
    gradient: "linear-gradient(180deg, #0c1a2e 0%, #0f2744 100%)",
    label: "Hope Hub",
    links: [
      { to: "/user/dashboard", icon: <LayoutDashboard size={20} />, label: "Home" },
      { to: "/user/profile",   icon: <UserCircle size={20} />,      label: "Profile" },
      { to: "/user/funding",   icon: <HandCoins size={20} />,       label: "Request Funding" },
      { to: "/user/settings",  icon: <Settings size={20} />,        label: "Settings" },
    ],
  },
  donor: {
    color: "#10B981",
    gradient: "linear-gradient(180deg, #052e16 0%, #064e3b 100%)",
    label: "Donor Panel",
    links: [
      { to: "/donor/dashboard", icon: <BarChart2 size={20} />,   label: "Donation Stats" },
      { to: "/donor/payments",  icon: <CreditCard size={20} />,  label: "Payment History" },
      { to: "/donor/campaigns", icon: <Target size={20} />,      label: "Active Campaigns" },
      { to: "/donor/profile",   icon: <UserCircle size={20} />,  label: "Profile Settings" },
    ],
  },
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const config = NAV_CONFIG[user?.role] || NAV_CONFIG.user;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NOTIFICATIONS = [
    { icon: "💰", text: "New donation of ₹5,000 received", time: "2 min ago" },
    { icon: "🙋", text: "New volunteer registration", time: "15 min ago" },
    { icon: "📢", text: "Campaign 'Clean Water' reached 80%", time: "1 hr ago" },
    { icon: "✉️", text: "New contact message from Rahul", time: "3 hrs ago" },
  ];

  return (
    <div className="dash-layout">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`} style={{ background: config.gradient }}>
        {/* Brand */}
        <div className="dash-sidebar-brand">
          <div className="dash-brand-logo" style={{ background: config.color }}>H&H</div>
          <div>
            <p className="dash-brand-name">Hope & Help</p>
            <p className="dash-brand-role">{config.label}</p>
          </div>
          <button className="dash-close-btn d-lg-none" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User mini-profile */}
        <div className="dash-user-mini">
          <img src={user?.avatar} alt={user?.name} className="dash-user-avatar" />
          <div>
            <p className="dash-user-name">{user?.name}</p>
            <p className="dash-user-email">{user?.email}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="dash-nav">
          {config.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `dash-nav-link ${isActive ? "active" : ""}`}
              style={({ isActive }) => isActive ? { color: config.color, background: `${config.color}18` } : {}}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="dash-nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="dash-sidebar-footer">
          <NavLink to="/" className="dash-nav-link">
            <span className="dash-nav-icon"><Heart size={20} /></span>
            <span>Main Website</span>
          </NavLink>
          <button className="dash-nav-link dash-logout-btn" onClick={handleLogout}>
            <span className="dash-nav-icon"><LogOut size={20} /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="dash-main">
        {/* Top navbar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button className="dash-menu-btn d-lg-none" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="dash-topbar-right">
            {/* Notifications */}
            <div className="dash-notif-wrap">
              <button className="dash-icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={20} />
                <span className="dash-badge">4</span>
              </button>
              {notifOpen && (
                <div className="dash-notif-dropdown">
                  <div className="dash-notif-header">
                    <span>Notifications</span>
                    <button onClick={() => setNotifOpen(false)}><X size={16} /></button>
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="dash-notif-item">
                      <span className="dash-notif-emoji">{n.icon}</span>
                      <div>
                        <p>{n.text}</p>
                        <small>{n.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="dash-profile">
              <img src={user?.avatar} alt={user?.name} />
              <div className="d-none d-md-block">
                <p className="dash-profile-name">{user?.name}</p>
                <p className="dash-profile-role text-capitalize">{user?.role}</p>
              </div>
              <ChevronDown size={14} className="text-muted" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
