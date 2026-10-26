import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SeeRPGDashboard() {
  const navigate = useNavigate();

  // --- ÁLLAPOTOK (LocalStorage betöltéssel) ---
  
  // 1. Kártya: PrimeInvest Hosszútáv
  const [primeCapital, setPrimeCapital] = useState(
    Number(localStorage.getItem("seeRpgPrimeCapital")) || 823207955
  );
  const [primeHours, setPrimeHours] = useState(
    Number(localStorage.getItem("seeRpgPrimeHours")) || 12
  );

  // 2. Kártya: Célkitűzés (ÚJ)
  const [targetStartCapital, setTargetStartCapital] = useState(
    Number(localStorage.getItem("seeRpgTargetStart")) || 823207955
  );
  const [targetGoal, setTargetGoal] = useState(
    Number(localStorage.getItem("seeRpgTargetGoal")) || 1000000000
  );

  // --- LOCALSTORAGE MENTÉS ---
  useEffect(() => localStorage.setItem("seeRpgPrimeCapital", primeCapital), [primeCapital]);
  useEffect(() => localStorage.setItem("seeRpgPrimeHours", primeHours), [primeHours]);
  useEffect(() => localStorage.setItem("seeRpgTargetStart", targetStartCapital), [targetStartCapital]);
  useEffect(() => localStorage.setItem("seeRpgTargetGoal", targetGoal), [targetGoal]);

  // --- SZÁMÍTÁSOK: 1. KÁRTYA ---
  const primeFinalBalance = Math.floor(primeCapital * Math.pow(1.006, primeHours));
  const primeProfit = primeFinalBalance - primeCapital;
  const primeCycles = (primeHours / 12).toFixed(1);

  // --- SZÁMÍTÁSOK: 2. KÁRTYA ---
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
    container: { position: "relative", boxSizing: "border-box", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#1e1e24", color: "#d1d5db", padding: "40px 20px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" },
    titleContainer: { textAlign: "center", marginBottom: "40px", marginTop: "20px" },
    titleSee: { color: "#eeb32a", textShadow: "2px 2px 0px #111, 4px 4px 0px rgba(0,0,0,0.4)", fontSize: "2.8rem", fontWeight: "900", letterSpacing: "1px" },
    titleRPG: { color: "#ffffff", textShadow: "2px 2px 0px #111, 4px 4px 0px rgba(0,0,0,0.4)", fontSize: "2.8rem", fontWeight: "900", letterSpacing: "1px" },
    titleText: { color: "#a1a5ab", textShadow: "1px 1px 2px #000", fontSize: "2.2rem", fontWeight: "bold" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "30px", maxWidth: "1000px", width: "100%" },
    card: { boxSizing: "border-box", backgroundColor: "#292b2f", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column" },
    cardTitle: { marginTop: 0, color: "#ffffff", fontSize: "1.2rem", borderBottom: "2px solid #40444b", paddingBottom: "15px", marginBottom: "25px", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "10px" },
    inputGroup: { display: "flex", flexDirection: "column", marginBottom: "20px" },
    label: { marginBottom: "8px", fontSize: "0.95rem", color: "#b9bbbe", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { boxSizing: "border-box", padding: "12px 15px", borderRadius: "6px", border: "1px solid #202225", backgroundColor: "#40444b", color: "#fff", fontSize: "1.2rem", outline: "none", fontWeight: "bold", transition: "all 0.2s", width: "100%" },
    statRow: { display: "flex", justifyContent: "space-between", margin: "12px 0", fontSize: "1.1rem" },
    highlightGreen: { color: "#43b581", fontWeight: "bold" },
    highlightYellow: { color: "#eeb32a", fontWeight: "bold" },
    highlightBlue: { color: "#00b0f4", fontWeight: "bold" },
    divider: { height: "1px", backgroundColor: "#40444b", margin: "25px 0", border: "none" },
    alertBox: { padding: "15px", borderRadius: "6px", marginTop: "15px", fontWeight: "bold", textAlign: "center", backgroundColor: "rgba(0, 176, 244, 0.1)", color: "#00b0f4", border: "1px solid rgba(0, 176, 244, 0.3)" },
    footer: { textAlign: "center", marginTop: "50px", color: "#303338", fontSize: "2.5rem", fontWeight: "900", letterSpacing: "12px", textTransform: "uppercase", textShadow: "1px 1px 0px #111, 2px 2px 0px rgba(238, 179, 42, 0.1)", userSelect: "none" }
  };

  return (
    <div style={styles.container}>
      
      {/* Vissza gomb a bal felső sarokban */}
      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '20px', left: '20px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', zIndex: 1000 }}
      >
        ⬅ Home page
      </button>

      <div style={styles.titleContainer}>
        <h1>
          🏦 <span style={styles.titleSee}>See</span><span style={styles.titleRPG}>RPG</span> <span style={styles.titleText}>Lekötés</span>
        </h1>
      </div>

      <div style={styles.grid}>
        
        {/* 1. KÁRTYA: PRIME INVEST HOSSZÚTÁVÚ KALKULÁTOR */}
        <div style={{ ...styles.card, borderTop: "5px solid #43b581" }}>
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

        {/* 2. KÁRTYA: CÉLKITŰZÉS KALKULÁTOR */}
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
              <div style={{...styles.alertBox, backgroundColor: "rgba(67, 181, 129, 0.1)", color: "#43b581", border: "1px solid rgba(67, 181, 129, 0.3)"}}>
                🎉 A célodat már el is érted!
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* GIZDA FOOTER */}
      <div style={styles.footer}>
        @FICZABARNI
      </div>
    </div>
  );
}