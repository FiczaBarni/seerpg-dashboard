import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Lekotes() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Töltés állapot, hogy ne írja felül az adatbázist betöltés előtt
  
  // --- ÁLLAPOTOK (Alapértelmezett értékekkel) ---
  const [primeCapital, setPrimeCapital] = useState(823207955);
  const [primeHours, setPrimeHours] = useState(12);
  const [targetStartCapital, setTargetStartCapital] = useState(823207955);
  const [targetGoal, setTargetGoal] = useState(1000000000);

  // --- 1. FIREBASE: FELHASZNÁLÓ ÉS ADATOK BETÖLTÉSE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Ha be van jelentkezve, lekérjük a mentett adatait
        const docRef = doc(db, "lekotesek", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.primeCapital) setPrimeCapital(data.primeCapital);
          if (data.primeHours) setPrimeHours(data.primeHours);
          if (data.targetStartCapital) setTargetStartCapital(data.targetStartCapital);
          if (data.targetGoal) setTargetGoal(data.targetGoal);
        }
      }
      setLoading(false); // Betöltés kész
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FIREBASE: AUTOMATIKUS MENTÉS VÁLTOZÁSKOR ---
  useEffect(() => {
    // Csak akkor mentünk, ha be van lépve és már betöltött az oldal
    if (user && !loading) {
      const saveData = async () => {
        const docRef = doc(db, "lekotesek", user.uid);
        await setDoc(docRef, {
          primeCapital,
          primeHours,
          targetStartCapital,
          targetGoal
        }, { merge: true }); // A merge biztosítja, hogy csak frissít
      };
      saveData();
    }
  }, [primeCapital, primeHours, targetStartCapital, targetGoal, user, loading]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- SZÁMÍTÁSOK ---
  const primeFinalBalance = Math.floor(primeCapital * Math.pow(1.006, primeHours));
  const primeProfit = primeFinalBalance - primeCapital;
  const primeCycles = (primeHours / 12).toFixed(1);

  let requiredHours = 0;
  let requiredCyclesExact = 0;
  let actualFinalBalance = 0;
  
  if (targetGoal > targetStartCapital && targetStartCapital > 0) {
    requiredHours = Math.log(targetGoal / targetStartCapital) / Math.log(1.006);
    requiredCyclesExact = requiredHours / 12;
    const roundedCycles = Math.ceil(requiredCyclesExact);
    actualFinalBalance = Math.floor(targetStartCapital * Math.pow(1.006, roundedCycles * 12));
  }
  
  const roundedUpCycles = Math.ceil(requiredCyclesExact);
  const totalRequiredHours = roundedUpCycles * 12;

  // --- FORMATÁLÓ FÜGGVÉNYEK ---
  const formatNumberWithSpaces = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  const formatFt = (num) => formatNumberWithSpaces(num) + " Ft";

  const handleInputChange = (setter) => (e) => {
    const rawValue = e.target.value.replace(/\s/g, "");
    if (!isNaN(rawValue) && rawValue !== "") {
      setter(Number(rawValue));
    } else if (rawValue === "") {
      setter(0);
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
    titleSee: { color: "#eeb32a", textShadow: "2px 2px 0px #111, 4px 4px 0px rgba(0,0,0,0.4)", fontSize: "2.8rem", fontWeight: "900", letterSpacing: "1px" },
    titleRPG: { color: "#ffffff", textShadow: "2px 2px 0px #111, 4px 4px 0px rgba(0,0,0,0.4)", fontSize: "2.8rem", fontWeight: "900", letterSpacing: "1px" },
    titleText: { color: "#a1a5ab", textShadow: "1px 1px 2px #000", fontSize: "2.2rem", fontWeight: "bold" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "30px", maxWidth: "1000px", width: "100%" },
    card: { boxSizing: "border-box", backgroundColor: "#1e2128", padding: "30px", borderRadius: "12px", boxShadow: "0 15px 35px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column" },
    cardTitle: { marginTop: 0, color: "#ffffff", fontSize: "1.2rem", borderBottom: "2px solid rgba(255,255,255,0.05)", paddingBottom: "15px", marginBottom: "25px", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "10px" },
    inputGroup: { display: "flex", flexDirection: "column", marginBottom: "20px" },
    label: { marginBottom: "8px", fontSize: "0.95rem", color: "#b9bbbe", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { boxSizing: "border-box", padding: "12px 15px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#111216", color: "#fff", fontSize: "1.2rem", outline: "none", fontWeight: "bold", transition: "all 0.2s", width: "100%" },
    statRow: { display: "flex", justifyContent: "space-between", margin: "12px 0", fontSize: "1.1rem" },
    highlightGreen: { color: "#4ade80", fontWeight: "bold" },
    highlightBlue: { color: "#00b0f4", fontWeight: "bold" },
    divider: { height: "1px", backgroundColor: "rgba(255,255,255,0.05)", margin: "25px 0", border: "none" },
    alertBox: { padding: "15px", borderRadius: "6px", marginTop: "15px", fontWeight: "bold", textAlign: "center", backgroundColor: "rgba(0, 176, 244, 0.1)", color: "#00b0f4", border: "1px solid rgba(0, 176, 244, 0.3)" },
    footer: { textAlign: "center", marginTop: "50px", color: "rgba(255,255,255,0.05)", fontSize: "2.5rem", fontWeight: "900", letterSpacing: "12px", textTransform: "uppercase" }
  };

  if (loading) return <div style={{...styles.container, justifyContent: 'center'}}><h2>Adatok betöltése...</h2></div>;

  return (
    <div style={styles.container}>
      
      {/* 🚀 FELSŐ SÁV (NAVBAR) */}
      <div style={styles.navbar}>
        <div onClick={() => navigate('/')} style={styles.logo}>BARNI-SEERPG</div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#a1a5ab', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Bejelentkezve: <b style={{ color: '#4ade80', fontSize: '1rem', marginLeft: '5px' }}>{user.email.split('@')[0]}</b>
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
        <h1>
          🏦 <span style={styles.titleSee}>See</span><span style={styles.titleRPG}>RPG</span> <span style={styles.titleText}>Lekötés</span>
        </h1>
      </div>

      <div style={styles.grid}>
        
        {/* 1. KÁRTYA */}
        <div style={{ ...styles.card, borderTop: "5px solid #4ade80" }}>
          <h2 style={styles.cardTitle}>📈 Hosszútávú Tervező</h2>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Induló tőke (Ft)</label>
            <input 
              type="text" 
              value={formatNumberWithSpaces(primeCapital)} 
              onChange={handleInputChange(setPrimeCapital)} 
              style={styles.input} 
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tervezett futamidő (Játszott óra)</label>
            <input 
              type="text" 
              value={formatNumberWithSpaces(primeHours)} 
              onChange={handleInputChange(setPrimeHours)} 
              style={styles.input} 
            />
          </div>

          <div style={{ marginTop: "auto" }}>
            <hr style={styles.divider} />
            
            <div style={styles.statRow}>
              <span>12 órás ciklusok száma:</span>
              <span style={{ color: "#b9bbbe", fontWeight: "bold" }}>{primeCycles} db</span>
            </div>
            
            <div style={styles.statRow}>
              <span>Tiszta kamat (Profit):</span>
              <span style={styles.highlightGreen}>+ {formatFt(primeProfit)}</span>
            </div>
            
            <div style={styles.statRow}>
              <span style={{ fontWeight: "bold" }}>Várható záró egyenleg:</span>
              <span style={styles.highlightGreen}>{formatFt(primeFinalBalance)}</span>
            </div>
          </div>
        </div>

        {/* 2. KÁRTYA */}
        <div style={{ ...styles.card, borderTop: "5px solid #00b0f4" }}>
          <h2 style={styles.cardTitle}>🎯 Célkitűzés Kalkulátor</h2>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Jelenlegi tőke (Ft)</label>
            <input 
              type="text" 
              value={formatNumberWithSpaces(targetStartCapital)} 
              onChange={handleInputChange(setTargetStartCapital)} 
              style={{ ...styles.input, borderColor: "rgba(0, 176, 244, 0.3)" }} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Elérni kívánt cél (Ft)</label>
            <input 
              type="text" 
              value={formatNumberWithSpaces(targetGoal)} 
              onChange={handleInputChange(setTargetGoal)} 
              style={{ ...styles.input, borderColor: "rgba(238, 179, 42, 0.4)", color: "#eeb32a" }} 
            />
          </div>

          <div style={{ marginTop: "auto" }}>
            <hr style={styles.divider} />
            
            {targetGoal > targetStartCapital ? (
              <>
                <div style={styles.statRow}>
                  <span>Szükséges 12h lekötések:</span>
                  <span style={styles.highlightBlue}>{roundedUpCycles} db</span>
                </div>
                
                <div style={styles.statRow}>
                  <span>Összes aktív játszott óra:</span>
                  <span style={{ color: "#b9bbbe", fontWeight: "bold" }}>~ {totalRequiredHours} óra</span>
                </div>

                <div style={styles.alertBox}>
                  Végösszeg a cél elérésekor:<br/>
                  <span style={{ fontSize: "1.2rem", display: "block", marginTop: "5px" }}>{formatFt(actualFinalBalance)}</span>
                </div>
              </>
            ) : (
              <div style={{...styles.alertBox, backgroundColor: "rgba(74, 222, 128, 0.1)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.3)"}}>
                🎉 A célodat már el is érted!
              </div>
            )}
          </div>
        </div>

      </div>
      
      <div style={styles.footer}>
        @FICZABARNI
      </div>
    </div>
  );
}