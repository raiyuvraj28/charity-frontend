import { useState, useEffect, useCallback } from "react";

import API from "../config/api";
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const useNotifications = (mode = "my") => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const url = mode === "admin" ? `${API}/notifications/admin` : `${API}/notifications/my`;
      const headers = {};
      const token = localStorage.getItem("token");
      if (token && mode !== "admin") headers.Authorization = `Bearer ${token}`;

      const res = await fetch(url, { headers });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      /* keep last list */
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
    const body = mode === "admin"
      ? { audience: "admin" }
      : { audience: authUser.role, userId: authUser.id };
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const items = notifications.map((n) => ({
    id: n._id,
    icon: n.icon || "bell",
    text: n.message,
    title: n.title,
    time: formatTime(n.createdAt),
    read: n.read,
    link: n.link,
  }));

  return { items, unreadCount, loading, fetchNotifications, markRead, markAllRead };
};

export default useNotifications;
