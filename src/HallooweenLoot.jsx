import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function HalloweenLoot() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LÁDA TÁRGYAK ÁLLAPOTA ---
  const initialLoot = {
    cash: 0,
    pp: 0,
    pumpkin: 0,
    coupon: 0,
    vehicle: 0,
    weapon: 0
  };
  const [loot, setLoot] = useState(initialLoot);

  // --- 1. FIREBASE: ADATOK BETÖLTÉSE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "lootbox", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().loot) {
          setLoot(docSnap.data().loot);
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
        const docRef = doc(db, "lootbox", user.uid);
        await setDoc(docRef, { loot }, { merge: true });
      };
      saveData();
    }
  }, [loot, user, loading]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- LOGIKA: + / - GOMBOK ---
  const handleIncrement = (id) => {
    setLoot((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id) => {
    setLoot((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  const handleReset = () => {
    if (window.confirm("Biztosan lenullázod az eddigi nyitásokat?")) {
      setLoot(initialLoot);
    }
  };

  const totalOpened = Object.values(loot).reduce((acc, curr) => acc + curr, 0);

  // --- KATEGÓRIÁK ---
  const categories = [
    { id: 'cash', name: 'Készpénz', icon: '💵', color: '#4ade80' },
    { id: 'pp', name: 'Prémium Pont', icon: '💎', color: '#00b0f4' },
    { id: 'pumpkin', name: 'Tök / Cukorka', icon: '🎃', color: 'orange' },
    { id: 'coupon', name: 'Kupon / Egyéb', icon: '🎟️', color: '#facc15' },
    { id: 'vehicle', name: 'Jármű', icon: '🚗', color: '#f87171' },
    { id: 'weapon', name: 'Fegyver / Lőszer', icon: '🔫', color: '#a78bfa' },
  ];

  // --- STÍLUSOK ---
  const styles = {
    container: { position: "relative", boxSizing: "border-box", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#111216", color: "#d1d5db", padding: "100px 20px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" },
    navbar: { position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(17, 18, 22, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 },
    logo: { fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', color: '#eeb32a', textShadow: '0 0 10px rgba(238, 179, 42, 0.3)', cursor: 'pointer', userSelect: 'none' },
    authBtn: { padding: '8px 15px', backgroundColor: '#00b0f4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
    logoutBtn: { padding: '8px 15px', backgroundColor: 'transparent', color: '#ff4a4a', border: '1px solid #ff4a4a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    titleContainer: { textAlign: "center", marginBottom: "40px", marginTop: "20px" },
    titleMain: { color: "#a78bfa", textShadow: "0 0 15px rgba(167, 139, 250, 0.4)", fontSize: "2.8rem", fontWeight: "900", letterSpacing: "1px", margin: 0 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", maxWidth: "800px", width: "100%", marginBottom: "40px" },
    itemCard: (borderColor) => ({ backgroundColor: "#1e2128", borderTop: `4px solid ${borderColor}`, padding: "20px 10px", borderRadius: "12px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }),
    icon: { fontSize: "2.5rem" },
    itemName: { fontSize: "1rem", fontWeight: "bold", color: "white", margin: 0 },
    countBox: { fontSize: "1.8rem", fontWeight: "900", color: "#fff", margin: "10px 0" },
    btnRow: { display: "flex", gap: "10px", width: "100%", justifyContent: "center" },
    btnStyle: (bg) => ({ backgroundColor: bg, border: "none", borderRadius: "6px", color: "white", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.1s" }),
    summaryCard: { backgroundColor: "#1e2128", borderTop: "5px solid #eeb32a", padding: "30px", borderRadius: "12px", width: "100%", maxWidth: "800px", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.4)" },
    resetBtn: { marginTop: "20px", padding: "10px 20px", backgroundColor: "transparent", color: "#ff4a4a", border: "1px solid #ff4a4a", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }
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
                  Bejelentkezve: <b style={{ color: '#a78bfa', fontSize: '1rem', marginLeft: '5px' }}>{user.email.split('@')[0]}</b>
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
        <h1 style={styles.titleMain}>🎁 Ládanyitás Logger</h1>
      </div>

      {/* 📊 GRID: KATEGÓRIÁK */}
      <div style={styles.grid}>
        {categories.map((cat) => (
          <div key={cat.id} style={styles.itemCard(cat.color)}>
            <div style={styles.icon}>{cat.icon}</div>
            <h3 style={styles.itemName}>{cat.name}</h3>
            <div style={styles.countBox}>{loot[cat.id]}</div>
            <div style={styles.btnRow}>
              <button onClick={() => handleDecrement(cat.id)} style={styles.btnStyle('#ff4a4a')}>-</button>
              <button onClick={() => handleIncrement(cat.id)} style={styles.btnStyle('#4ade80')}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* 📝 ÖSSZESÍTŐ */}
      <div style={styles.summaryCard}>
        <h2 style={{ margin: "0 0 15px 0", color: "#eeb32a", textTransform: "uppercase" }}>Összesítés</h2>
        <p style={{ fontSize: "1.5rem", color: "#b9bbbe", margin: 0 }}>
          Eddig kinyitott ládák száma: <b style={{ color: "white", fontSize: "2rem", marginLeft: "10px" }}>{totalOpened} db</b>
        </p>
        
        <button onClick={handleReset} style={styles.resetBtn}>
          🔄 Nyitások Lenullázása
        </button>
      </div>

    </div>
  );
}