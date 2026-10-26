// Cseréld az importokat erre felül:
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Lekotes from './Lekotes';
import HalloweenPass from './HalloweenPass';
import Auth from './Auth'; // <-- Ez az új import

// És a <Routes> blokkba szúrd be ezt:
<Route path="/auth" element={<Auth />} />
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lekotes" element={<Lekotes />} />
          <Route path="/halloween-pass" element={<HalloweenPass />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        
        {/* Közös jogi nyilatkozat minden oldalon */}
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '15px', 
          fontSize: '11px', 
          color: 'rgba(255, 255, 255, 0.2)', /* Halvány átlátszó fehér */
          pointerEvents: 'none', /* Ne zavarjon be a kattintásokba */
          zIndex: 9999
        }}>
          Az oldal semmilyen formában nem áll kapcsolatban a SeeRPG szerverével.
        </div>
      </div>
    </BrowserRouter>
  );
}