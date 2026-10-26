import { useNavigate } from 'react-router-dom';

export default function HalloweenPass() {
  const navigate = useNavigate();

  return (
    <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
      <h1>🎃 Halloween Pass 🎃</h1>
      <p>Ide jöhet az új tartalom!</p>
      
      <button onClick={() => navigate('/')} style={{ padding: '10px 20px', marginTop: '20px' }}>
        ⬅ Vissza a főoldalra
      </button>
    </div>
  );
}