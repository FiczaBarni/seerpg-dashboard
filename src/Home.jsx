import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px', color: 'white' }}>
      <h1>Melyik alkalmazást szeretnéd megnyitni?</h1>
      
      <button 
        onClick={() => navigate('/lekotes')}
        style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#1e2128', color: 'white', border: '2px solid #4ade80', borderRadius: '8px' }}
      >
        💰 SeeRPG Lekötés
      </button>

      <button 
        onClick={() => navigate('/halloween-pass')}
        style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#1e2128', color: 'orange', border: '2px solid orange', borderRadius: '8px' }}
      >
        🎃 Halloween Pass
      </button>
    </div>
  );
}