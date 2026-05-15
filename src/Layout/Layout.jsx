import React from "react";
import Header from "../Components/Header";
import Navbar from "../Components/Navbar";   // 👈 add this
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header />
      <Navbar />   {/* 👈 yaha show hoga */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;