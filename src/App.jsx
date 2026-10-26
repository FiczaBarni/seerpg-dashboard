import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Lekotes from './Lekotes';
import HalloweenPass from './HalloweenPass';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Főoldal a két gombbal */}
        <Route path="/" element={<Home />} />
        
        {/* Régi lekötés oldal */}
        <Route path="/lekotes" element={<Lekotes />} />
        
        {/* Új halloween oldal */}
        <Route path="/halloween-pass" element={<HalloweenPass />} />
      </Routes>
    </BrowserRouter>
  );
}