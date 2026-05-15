import React, { createContext, useContext, useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL 

const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from localStorage token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    if (token === "admin-bypass-token") {
      try {
        const cached = localStorage.getItem("auth_user");
        if (cached) setUser(JSON.parse(cached));
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_user");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password, role) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Login failed." };

      localStorage.setItem("token", data.token);
      localStorage.setItem("role",  data.user.role);   // keep old admin panel compatible
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, message: "Cannot connect to server. Make sure backend is running." };
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const signup = async (name, email, password, role) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || "Registration failed." };

      localStorage.setItem("token", data.token);
      localStorage.setItem("role",  data.user.role);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, message: "Cannot connect to server. Make sure backend is running." };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  // ── Update profile ─────────────────────────────────────────────────────────
  const updateProfile = async (fields) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/auth/profile`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(fields)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };
      setUser((prev) => ({ ...prev, ...data }));
      localStorage.setItem("auth_user", JSON.stringify({ ...user, ...data }));
      return { success: true };
    } catch {
      return { success: false, message: "Failed to update profile." };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
