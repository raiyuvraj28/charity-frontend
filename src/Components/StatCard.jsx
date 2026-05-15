import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ icon, title, value, trend, trendUp = true, color = "#0EA5E9", delay = 0 }) => {
  return (
    <div
      className="stat-card animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, borderTop: `3px solid ${color}` }}
    >
      <div className="stat-card-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className="stat-card-body">
        <p className="stat-card-title">{title}</p>
        <h3 className="stat-card-value">{value}</h3>
        {trend && (
          <p className="stat-card-trend" style={{ color: trendUp ? "#10b981" : "#ef4444" }}>
            {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="ms-1">{trend}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
