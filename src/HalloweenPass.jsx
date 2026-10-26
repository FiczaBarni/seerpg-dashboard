import { useNavigate } from 'react-router-dom';

export default function HalloweenPass() {
  const navigate = useNavigate();

  return (
    <div style={{ color: 'white', padding: '50px', position: 'relative', minHeight: '100vh' }}>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '20px', left: '20px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        ⬅ Home page
      </button>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1>🎃 Halloween Pass 🎃</h1>
        <p>Ide jöhet az új tartalom!</p>
      </div>
      
    </div>
  );
}