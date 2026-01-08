import React, {useEffect, useState} from 'react';

import {supabase} from '../services/supabaseClient';

export default function AuthModal({ open, defaultmode='login', onClose, onSuccess}){

    const [mode,setMode]= useState(defaultmode);
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [status, setStatus]=useState("");
    const [loading, setLoading]=useState(false);

    useEffect(() => {
  if (open) {
    setMode(mode);
    setStatus("");
  }
}, [open, mode]);


    if (!open) return null;

    async function handleLogin() {
       
        setLoading(true);
        setStatus("");
        const {error}=await supabase.auth.signInWithPassword({email, password});
        if (error) {
            setStatus(error.message);
            setLoading(false);

            return;}

            setLoading(false);
        if (onSuccess) onSuccess();   //this is passed from the parent component

        }

    async function handleSignup() {
    setLoading(true);
     setStatus("");
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    setStatus(error.message);
    setLoading(false);
    return;
  }
  setStatus("Check your email to confirm your account!");
  setLoading(false);

}



   
  const styles = {
    backdrop: {
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 120,
      padding: 16,
    },
    modal: {
      width: "100%",
      maxWidth: 420,
      borderRadius: 18,
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      boxShadow: "0 24px 50px rgba(15, 23, 42, 0.18)",
      padding: 22,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    title: { margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text)" },
    close: {
      border: "1px solid #E2E8F0",
      background: "#FFFFFF",
      borderRadius: 10,
      width: 32,
      height: 32,
      cursor: "pointer",
      fontSize: 16,
    },
    sub: { margin: "0 0 16px", color: "var(--muted)", fontSize: 14 },
    field: { display: "grid", gap: 6, marginBottom: 12 },
    label: { fontSize: 13, fontWeight: 700, color: "var(--muted-2)" },
    input: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #E2E8F0",
      fontSize: 14,
    },
    tabs: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 12,
    },
    tab: (active) => ({
      padding: "10px 12px",
      borderRadius: 12,
      border: active ? "1px solid #0F172A" : "1px solid #E2E8F0",
      background: active ? "#0F172A" : "#FFFFFF",
      color: active ? "#FFFFFF" : "var(--text)",
      fontWeight: 700,
      cursor: "pointer",
    }),
    btn: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #0F172A",
      background: "#0F172A",
      color: "#FFFFFF",
      fontWeight: 700,
      cursor: "pointer",
    },
    status: { marginTop: 12, fontSize: 13, color: "var(--muted)" },
  button: {
  padding: "10px 14px",
  borderRadius: 12,
  background: "#0F172A",
  color: "#FFFFFF",
  border: "1px solid #0F172A",
  cursor: "pointer",
  fontWeight: 700,
},

  };


    

    return (
        <div style={styles.backdrop} onClick={onClose}>
           < div style={styles.modal} onClick={(e)=>e.stopPropagation()}>
                <div style ={styles.header}>
                    <h2 style={styles.title}>Account</h2>
                    <button  onClick={onClose}> {/* This on close is passed from the parent component */}
                        ×
                    </button>
                </div>
                    <p style={styles.sub}>Login or create an account to see past results</p>
                    <div style={styles.tabs}> 
                        <button style={styles.tab(mode=='login')} onClick={()=>setMode("login")}> 
                            Login
                        </button>
                        <button style={styles.tab(mode=="signup")} onClick={()=>setMode("signup")}>
                            Sign Up
                        </button>
                    </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Email</label>
                            <input 
                            style={styles.input}
                            type='email'
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder='you@example.com'
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}> Password</label>
                            <input 
                            style={styles.input}
                            type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            placeholder='Your password'
                            />

                        </div>
                        
                        {mode==='login' ? (
                            <button style={styles.button} onClick={handleLogin} disabled={loading}>
                                {loading ? "Loading ..." : "Login"}
        
                            </button>
                        ): (
                            <button style={styles.button} onClick={handleSignup} disabled={loading}>
                                {loading ? "Loading ..." : "Sign Up"}

                            </button>
                        )}

                        {status && <div style={styles.status}> {status}</div>}


                    


                
           </div>
            
        </div>
    )

 }