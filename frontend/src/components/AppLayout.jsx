import React, { useState, useEffect} from "react";
import AuthModal from "./AuthModal";
import { supabase } from "../services/supabaseClient";





import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [session, setSession] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
    setSessionReady(true);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    setSessionReady(true);
  });

  return () => subscription.unsubscribe();
}, []);

  useEffect(() => {
    if (!sessionReady) return;
    if (session) return;
    if (location.pathname === "/") return;
    setAuthMode("login");
    setAuthOpen(true);
    navigate("/", { replace: true });
  }, [session, sessionReady, location.pathname, navigate]);







  function toggleSidebar() {

     setSidebarOpen(prev => !prev); 

    }

  function openAuth(mode){
      setAuthMode (mode);
      setAuthOpen(true);
    }

  async function handleLogout() {
  await supabase.auth.signOut();
}


  
  function handleLoginClick(){
      console.log("login clicked");
      setAuthMode("login");
      setAuthOpen (true);
  }

  function handleSignupClick() {
      console.log("signup clicked:");
      setAuthMode("signup");
      setAuthOpen(true);
  }


  return (
    <div className="app-shell">
      <AuthModal
         open={authOpen}
         mode={authMode}
         onClose={() => setAuthOpen(false)}
         onSuccess={() => setAuthOpen(false)}
         />


      <Topbar onToggleSidebar={toggleSidebar} onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} isLoggedIn={Boolean(session)} onLogout={handleLogout} />

      <div className="app-body">

        <div className={`app-sidebar ${sidebarOpen ? "" : "closed"}`}>
          <Sidebar />
        </div>

        <div className="app-content">
          <div className="app-content-inner">

            <Outlet context={{ session }} />

          </div>
        </div>
      </div>
    </div>
  );
}
