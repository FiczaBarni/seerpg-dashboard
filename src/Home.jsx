import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // --- STÍLUSOK ---
  const styles = {
    container: { backgroundColor: '#111216', minHeight: '100vh', color: 'white', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    navbar: { position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(17, 18, 22, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 },
    logo: { fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', color: '#eeb32a', textShadow: '0 0 10px rgba(238, 179, 42, 0.3)', userSelect: 'none' },
    authBtn: { padding: '10px 20px', backgroundColor: '#00b0f4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0, 176, 244, 0.3)' },
    logoutBtn: { padding: '10px 20px', backgroundColor: 'transparent', color: '#ff4a4a', border: '1px solid #ff4a4a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
    hero: { textAlign: 'center', marginBottom: '50px', marginTop: '80px' },
    title: { fontSize: '4.5rem', fontWeight: '900', margin: '0 0 15px 0', background: 'linear-gradient(to right, #4ade80, #00b0f4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0px 10px 30px rgba(0, 176, 244, 0.2)' },
    subtitle: { fontSize: '1.3rem', color: '#8b929a', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' },
    cardContainer: { display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 10 },
    card: (borderColor) => ({ backgroundColor: '#1e2128', borderTop: `5px solid ${borderColor}`, borderRadius: '16px', padding: '40px 30px', width: '240px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', transition: 'transform 0.2s' }),
    cardIcon: { fontSize: '4rem', marginBottom: '20px' },
    cardTitle: { fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#fff' },
    footer: { position: 'absolute', bottom: '20px', color: 'rgba(255,255,255,0.05)', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '12px', textTransform: 'uppercase', pointerEvents: 'none', userSelect: 'none', zIndex: 1 }
  };

  return (
    <div style={styles.container}>
      
      {/* 🚀 FELSŐ SÁV */}
      <div style={styles.navbar}>
        <div style={styles.logo}>BARNI-SEERPG</div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '8px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#a1a5ab', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Bejelentkezve: <b style={{ color: '#4ade80', fontSize: '1.1rem', marginLeft: '5px' }}>{user.email.split('@')[0]}</b>
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

      {/* 💥 KÖZÉPSŐ TARTALOM (HERO) */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Válaszd ki az alkalmazást</h1>
        <p style={styles.subtitle}>Kezeld a lekötéseidet profi szinten, kövesd nyomon a Halloween Pass fejlődésedet, vagy logold a kinyitott ládáidat.</p>
      </div>

      {/* 🃏 ALKALMAZÁS KÁRTYÁK */}
      <div style={styles.cardContainer}>
        
        <div onClick={() => navigate('/lekotes')} style={styles.card('#4ade80')}>
          <div style={styles.cardIcon}>💰</div>
          <h3 style={styles.cardTitle}>Lekötés</h3>
        </div>

        <div onClick={() => navigate('/halloween-pass')} style={styles.card('orange')}>
          <div style={styles.cardIcon}>🎃</div>
          <h3 style={styles.cardTitle}>Halloween Pass</h3>
        </div>

        <div onClick={() => navigate('/loot')} style={styles.card('#a78bfa')}>
          <div style={styles.cardIcon}>🎁</div>
          <h3 style={styles.cardTitle}>Láda Logger</h3>
        </div>

      </div>

      {/* VÍZJEL CSAK A FŐOLDALON */}
      <div style={styles.footer}>
        @FICZABARNI
      </div>
    </div>
  );
}