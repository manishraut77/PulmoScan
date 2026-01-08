import React, { useEffect, useState } from "react";

export default function Topbar({ onToggleSidebar, onLoginClick, onSignupClick, isLoggedIn, onLogout }) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lightButtonStyle = {
    background: "#FFFFFF",
    color: "#0F172A",
    border: "1px solid #E2E8F0",
    boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
  };

  const darkButtonStyle = {
    background: "#0F172A",
    color: "#FFFFFF",
    border: "1px solid #0F172A",
    boxShadow: "0 10px 18px rgba(15, 23, 42, 0.18)",
  };

  const buttonStyle = isLoggedIn ? lightButtonStyle : darkButtonStyle;

  return (
    <div className={`topbar ${mounted ? "slideDown" : ""}`}>
      <div className="leftGroup">
        <button className="menuBtn" onClick={onToggleSidebar}>
          <span className="menuLine line1" />
          <span className="menuLine line2" />
          <span className="menuLine line3" />
        </button>
        <svg className="logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="12" r="6" fill="currentColor" />
          <rect x="8" y="20" width="24" height="14" rx="7" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="14" cy="27" r="2.5" fill="currentColor" />
          <circle cx="26" cy="27" r="2.5" fill="currentColor" />
        </svg>
        <div className="brand">Tubercluos Screening</div>
      </div>

      <div className="authGroup">
        {isLoggedIn ? (
    <button className="authBtn" onClick={onLogout}>
      Logout
    </button>
  ) : (
    <>
      <button className="authBtn loginBtn" onClick={onLoginClick}>
        Login
      </button>
      <button className="authBtn signupBtn" onClick={onSignupClick}>
        Sign up
      </button>
    </>
  )}
      </div>
    </div>
  );
}
