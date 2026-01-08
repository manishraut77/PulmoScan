import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 10.5V21h14V10.5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      ),
    },
    {
      label: "Diagnosis",
      path: "/diagnosis",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
        </svg>
      ),
    },
    {
      label: "Past Results",
      path: "/past-results",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="4" y="3.5" width="16" height="17" rx="3" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
          <path d="M16.5 15.5v3" />
          <path d="M15 17h3" />
        </svg>
      ),
    },
    {
      label: "About AI",
      path: "/about-ai",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 3l2.5 4.5L19 9l-4.5 2.5L12 16l-2.5-4.5L5 9l4.5-1.5L12 3z" />
          <circle cx="12" cy="12" r="7.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">Menu</div>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`sidebar-btn ${location.pathname === item.path ? "active" : ""}`}
        >
          <span className="sidebar-icon">{item.icon}</span>
          <span className="sidebar-text">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
