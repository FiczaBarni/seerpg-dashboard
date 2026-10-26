import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formatEmail = (user) => `${user.toLowerCase()}@seerpg.local`;

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, formatEmail(username), password);
      navigate('/');
    } catch (err) {
      setError('Hiba! A név már foglalt, vagy a jelszó túl rövid (min. 6 karakter).');
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, formatEmail(username), password);
      navigate('/');
    } catch (err) {
      setError('Hibás felhasználónév vagy jelszó!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white', backgroundColor: '#1e1e24' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '20px', left: '20px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        ⬅ Home page
      </button>

      <div style={{ backgroundColor: '#292b2f', padding: '40px', borderRadius: '12px', width: '300px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>🔐 Profil megadása</h2>
        
        <input 
          type="text" 
          placeholder="Felhasználónév" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#40444b', color: 'white', fontSize: '1rem', outline: 'none' }}
        />
        
        <input 
          type="password" 
          placeholder="Jelszó (min. 6 karakter)" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#40444b', color: 'white', fontSize: '1rem', outline: 'none' }}
        />

        {error && <p style={{ color: '#ff4a4a', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>{error}</p>}

        <button onClick={handleLogin} style={{ padding: '12px', backgroundColor: '#43b581', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
          Bejelentkezés
        </button>
        
        <button onClick={handleRegister} style={{ padding: '12px', backgroundColor: '#00b0f4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          Regisztráció
        </button>
      </div>
    </div>
  );
}