import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public layout
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Donate from "./Pages/Donate";
import NewsDetail from "./Pages/NewsDetail";
import NewsListing from "./Pages/NewsListing";

// Auth pages
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

// Old admin panel (kept as-is, default)
import AdminDashboard from "./Pages/AdminDashboard";
import AdminLogin from "./Pages/AdminLogin";

// Dashboard layout
import DashboardLayout from "./layouts/DashboardLayout";

// Admin pages
import AdminDashboardHome from "./dashboard/admin/AdminDashboardHome";
import ManageUsers from "./dashboard/admin/ManageUsers";
import ManageDonations from "./dashboard/admin/ManageDonations";
import AddNews from "./dashboard/admin/AddNews";
import AdminSettings from "./dashboard/admin/AdminSettings";

// User pages
import UserHome from "./dashboard/user/UserHome";
import UserProfile from "./dashboard/user/UserProfile";
import UserSettings from "./dashboard/user/UserSettings";
import FundingRequest from "./dashboard/user/FundingRequest";

// Donor pages
import DonorDashboard from "./dashboard/donor/DonorDashboard";
import PaymentHistory from "./dashboard/donor/PaymentHistory";
import ActiveCampaigns from "./dashboard/donor/ActiveCampaigns";
import DonorProfile from "./dashboard/donor/DonorProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public website (same as before) ── */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route
              path="donate"
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <Donate />
                </ProtectedRoute>
              }
            />
            <Route path="news" element={<NewsListing />} />
            <Route path="news/:id" element={<NewsDetail />} />
          </Route>

          {/* ── Auth pages ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Old admin panel — NO login required, direct access ── */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* ── New User dashboard ── */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserHome />} />
            <Route path="profile"   element={<UserProfile />} />
            <Route path="donations" element={<Navigate to="dashboard" replace />} />
            <Route path="settings"  element={<UserSettings />} />
            <Route path="funding"   element={<FundingRequest />} />
          </Route>

          {/* ── New Donor dashboard ── */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="payments"  element={<PaymentHistory />} />
            <Route path="campaigns" element={<ActiveCampaigns />} />
            <Route path="profile"   element={<DonorProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
