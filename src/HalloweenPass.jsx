import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function HalloweenPass() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Állapot a jelenlegi XP-hez
  const [currentXp, setCurrentXp] = useState(0);

  // --- 1. FIREBASE: ADATOK BETÖLTÉSE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "halloween", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().currentXp) {
          setCurrentXp(docSnap.data().currentXp);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FIREBASE: AUTOMATIKUS MENTÉS VÁLTOZÁSKOR ---
  useEffect(() => {
    if (user && !loading) {
      const saveData = async () => {
        const docRef = doc(db, "halloween", user.uid);
        await setDoc(docRef, { currentXp }, { merge: true });
      };
      saveData();
    }
  }, [currentXp, user, loading]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- HALLOWEEN PASS SZÁMÍTÁSOK ---
  const MAX_XP = 31000;
  const XP_PER_TIER = 1000;
  const MAX_DAILY_XP = 1025;
  const safeXp = Math.min(currentXp, MAX_XP);

  // Státusz számítások
  const currentTier = Math.floor(safeXp / XP_PER_TIER);
  const xpToNextTier = safeXp >= MAX_XP ? 0 : XP_PER_TIER - (safeXp % XP_PER_TIER);
  const remainingXp = MAX_XP - safeXp;
  const progressPercent = (safeXp / MAX_XP) * 100;

  // Dátum és idő számítások (Event vége: Nov. 30)
  const today = new Date();
  const endDate = new Date('2026-11-30T23:59:59');
  const diffTime = endDate - today;
  const daysRemaining = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

  const minDaysNeeded = Math.ceil(remainingXp / MAX_DAILY_XP);
  const skippableDays = daysRemaining - minDaysNeeded;

  // --- FORMATÁLÓ FÜGGVÉNY ---
  const formatNumberWithSpaces = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/\s/g, "");
    if (!isNaN(rawValue) && rawValue !== "") {
      setCurrentXp(Number(rawValue));
    } else if (rawValue === "") {
      setCurrentXp(0);
    }
  };

  // --- STÍLUSOK ---
  const styles = {
    container: { position: "relative", boxSizing: "border-box", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#111216", color: "#d1d5db", padding: "100px 20px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" },
    navbar: { position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(17, 18, 22, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 },
    logo: { fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', color: '#eeb32a', textShadow: '0 0 10px rgba(238, 179, 42, 0.3)', cursor: 'pointer', userSelect: 'none' },
    authBtn: { padding: '8px 15px', backgroundColor: '#00b0f4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
    logoutBtn: { padding: '8px 15px', backgroundColor: 'transparent', color: '#ff4a4a', border: '1px solid #ff4a4a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    titleContainer: { textAlign: "center", marginBottom: "40px", marginTop: "20px" },
    titleMain: { color: "orange", textShadow: "0 0 15px rgba(255, 165, 0, 0.4)", fontSize: "2.8rem", fontWeight: "900", letterSpacing: "1px", margin: 0 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "30px", maxWidth: "1000px", width: "100%" },
    card: { boxSizing: "border-box", backgroundColor: "#1e2128", padding: "30px", borderRadius: "12px", boxShadow: "0 15px 35px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", borderTop: "5px solid orange" },
    cardTitle: { marginTop: 0, color: "#ffffff", fontSize: "1.2rem", borderBottom: "2px solid rgba(255,255,255,0.05)", paddingBottom: "15px", marginBottom: "25px", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "10px" },
    inputGroup: { display: "flex", flexDirection: "column", marginBottom: "20px" },
    label: { marginBottom: "8px", fontSize: "0.95rem", color: "#b9bbbe", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { boxSizing: "border-box", padding: "12px 15px", borderRadius: "6px", border: "1px solid rgba(255,165,0,0.3)", backgroundColor: "#111216", color: "orange", fontSize: "1.2rem", outline: "none", fontWeight: "bold", transition: "all 0.2s", width: "100%" },
    statRow: { display: "flex", justifyContent: "space-between", margin: "12px 0", fontSize: "1.1rem" },
    divider: { height: "1px", backgroundColor: "rgba(255,255,255,0.05)", margin: "25px 0", border: "none" },
    progressBarBg: { width: "100%", height: "20px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden", marginTop: "15px" },
    progressBarFill: { width: `${progressPercent}%`, height: "100%", backgroundColor: "orange", transition: "width 0.5s ease", boxShadow: "0 0 10px orange" },
    alertBox: (isDanger) => ({ padding: "15px", borderRadius: "6px", marginTop: "15px", fontWeight: "bold", textAlign: "center", backgroundColor: isDanger ? "rgba(255, 74, 74, 0.1)" : "rgba(74, 222, 128, 0.1)", color: isDanger ? "#ff4a4a" : "#4ade80", border: `1px solid ${isDanger ? "rgba(255, 74, 74, 0.3)" : "rgba(74, 222, 128, 0.3)"}` }),
    footer: { textAlign: "center", marginTop: "50px", color: "rgba(255,255,255,0.05)", fontSize: "2.5rem", fontWeight: "900", letterSpacing: "12px", textTransform: "uppercase" }
  };

  if (loading) return <div style={{...styles.container, justifyContent: 'center'}}><h2>Adatok betöltése...</h2></div>;

  return (
    <div style={styles.container}>
      
      {/* 🚀 FELSŐ SÁV */}
      <div style={styles.navbar}>
        <div onClick={() => navigate('/')} style={styles.logo}>BARNI-SEERPG</div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#a1a5ab', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Bejelentkezve: <b style={{ color: 'orange', fontSize: '1rem', marginLeft: '5px' }}>{user.email.split('@')[0]}</b>
                </span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>Kijelentkezés</button>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} style={styles.authBtn}>
              🔐 Bejelentkezés
            </button>
          )}
        </div>
      </div>

      <div style={styles.titleContainer}>
        <h1 style={styles.titleMain}>🎃 Halloween Pass Kalkulátor</h1>
      </div>

      <div style={styles.grid}>
        
        {/* 1. KÁRTYA: STÁTUSZ */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Jelenlegi Státusz</h2>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Megszerzett XP (Max: 31 000)</label>
            <input 
              type="text" 
              value={formatNumberWithSpaces(currentXp)} 
              onChange={handleInputChange} 
              style={styles.input} 
            />
          </div>

          <div style={{ marginTop: "auto" }}>
            <hr style={styles.divider} />
            
            <div style={styles.statRow}>
              <span>Elért Tier:</span>
              <span style={{ color: "orange", fontWeight: "bold" }}>Tier {currentTier} / 31</span>
            </div>
            
            {safeXp < MAX_XP && (
              <div style={styles.statRow}>
                <span>XP a következő Tier-ig:</span>
                <span style={{ color: "#fff", fontWeight: "bold" }}>{formatNumberWithSpaces(xpToNextTier)} XP</span>
              </div>
            )}
            
            <div style={styles.statRow}>
              <span>Teljes haladás:</span>
              <span style={{ color: "#b9bbbe", fontWeight: "bold" }}>{progressPercent.toFixed(1)}%</span>
            </div>

            <div style={styles.progressBarBg}>
              <div style={styles.progressBarFill}></div>
            </div>
          </div>
        </div>

        {/* 2. KÁRTYA: IDŐBEOSZTÁS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>⏳ Időbeosztás (Nov. 30-ig)</h2>
          
          {safeXp >= MAX_XP ? (
            <div style={styles.alertBox(false)}>
              🎉 Gratulálok, kimaxoltad a Halloween Pass-t!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={styles.statRow}>
                <span>Eventből hátralévő napok:</span>
                <span style={{ color: "#fff", fontWeight: "bold" }}>{daysRemaining} nap</span>
              </div>
              
              <div style={styles.statRow}>
                <span>Szükséges napok (Max napi 1025 XP-vel):</span>
                <span style={{ color: "#fff", fontWeight: "bold" }}>{minDaysNeeded} nap</span>
              </div>
              
              <div style={styles.statRow}>
                <span>Napi aktív játékidő a limithez (525 XP/h):</span>
                <span style={{ color: "#b9bbbe", fontWeight: "bold" }}>~ 2 óra</span>
              </div>

              <div style={{ marginTop: "auto" }}>
                <hr style={styles.divider} />
                
                {skippableDays >= 0 ? (
                  <div style={styles.alertBox(false)}>
                    Még <span style={{ fontSize: '1.2rem', margin: '0 5px' }}>{skippableDays}</span> napot hagyhatsz ki a maxoláshoz!
                  </div>
                ) : (
                  <div style={styles.alertBox(true)}>
                    ⚠️ Ezt már sajnos nem lehet kimaxolni! {Math.abs(skippableDays)} nappal lemaradtál.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}