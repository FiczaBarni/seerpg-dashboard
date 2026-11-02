import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// --- KATEGÓRIÁK ÉS TÁRGYAK ADATBÁZISA ---
const itemCategories = [
  {
    id: "halloween", name: "Halloween Event", color: "#f97316",
    items: [
      { id: 1001, name: "Extra savanyú cukorka" }, 
      { id: 1002, name: "Túlvilági cukorka" }, 
      { id: 1003, name: "Halloween cukorka" }
    ]
  },
  {
    id: "weapons", name: "Fegyverek", color: "#f87171",
    items: [
      { id: 34, name: "Boxer" }, { id: 39, name: "Antik tőr" }, { id: 56, name: "Kés" }, { id: 74, name: "Rugós kés" }, { id: 76, name: "Baseball ütő" }, { id: 80, name: "Golfütő" }, { id: 82, name: "Gumibot" }, { id: 83, name: "Dákó" },
      { id: 33, name: "Ceramic Pistol" }, { id: 35, name: "SNS Pistol" }, { id: 36, name: "SNS Pistol MK2" }, { id: 40, name: "Arany Revolver" }, { id: 54, name: "Heavy Pistol" }, { id: 65, name: "Pistol" }, { id: 66, name: "Pistol .50" }, { id: 67, name: "Pistol MK2" }, { id: 73, name: "Sokkoló" }, { id: 75, name: "Vintage Pistol" },
      { id: 59, name: "Micro SMG" }, { id: 60, name: "Mini SMG" }, { id: 91, name: "Assault SMG" }, { id: 101, name: "Combat PDW" }, { id: 120, name: "SMG" }, { id: 71, name: "SMG MK2" },
      { id: 86, name: "Advanced Rifle" }, { id: 87, name: "Assault Rifle" }, { id: 88, name: "Assault Rifle MK2" }, { id: 92, name: "Bullpup Rifle" }, { id: 93, name: "Bullpup Rifle MK2" }, { id: 95, name: "Carbine Rifle" }, { id: 96, name: "Carbine Rifle MK2" }, { id: 103, name: "Compact Rifle" }, { id: 121, name: "Special Carbine" }, { id: 122, name: "Special Carbine MK2" },
      { id: 94, name: "Bullpup Shotgun" }, { id: 104, name: "Double Barrel Shotgun" }, { id: 117, name: "Pump Shotgun" }, { id: 118, name: "Pump Shotgun MK2" }, { id: 119, name: "Lefűrészelt csövű" },
      { id: 108, name: "Heavy Sniper" }, { id: 109, name: "Heavy Sniper MK2" }, { id: 113, name: "Sniper Rifle" }, { id: 114, name: "Marksman Rifle" }, { id: 115, name: "Marksman Rifle MK2" },
      { id: 355, name: "C4 robbanótöltet" }, { id: 358, name: "C4 robbanóanyag" }
    ]
  },
  {
    id: "ammo", name: "Lőszerek", color: "#fb923c",
    items: [
      { id: 21, name: "SMG lőszer (doboz)" }, { id: 23, name: "Rifle lőszer (doboz)" }, { id: 25, name: "Shotgun lőszer (doboz)" }, { id: 27, name: "MG lőszer (doboz)" }, { id: 29, name: "Pistol lőszer (doboz)" }
    ]
  },
  {
    id: "parts", name: "Fegyveralkatrészek & Blueprintek", color: "#9ca3af",
    items: [
      { id: 308, name: "Assault Rifle tok" }, { id: 309, name: "Assault Rifle zárszerkezet" }, { id: 310, name: "Assault Rifle tokfedél" }, { id: 311, name: "Assault Rifle válltámasz" }, { id: 312, name: "Assault Rifle előagy" }, { id: 313, name: "Assault Rifle pisztolymarkolat" }, { id: 314, name: "Assault Rifle tár" },
      { id: 325, name: "Mini SMG test (alsó)" }, { id: 326, name: "Mini SMG test (felső)" }, { id: 327, name: "Mini SMG válltámasz" }, { id: 328, name: "Mini SMG pisztolymarkolat" }, { id: 329, name: "Mini SMG tár" },
      { id: 330, name: "Lefűrészelt csövű test" }, { id: 331, name: "Lefűrészelt csövű cső" }, { id: 332, name: "Lefűrészelt csövű csőtár" }, { id: 333, name: "Lefűrészelt csövű előagy" }, { id: 334, name: "Lefűrészelt csövű pisztolymarkolat" },
      { id: 316, name: "Pistol test" }, { id: 317, name: "Pistol cső" }, { id: 318, name: "Pistol szán" }, { id: 319, name: "Pistol markolat" }, { id: 320, name: "Pistol tár" },
      { id: 339, name: "Blueprint_ Assault rifle" }, { id: 340, name: "Blueprint_ Pistol" }, { id: 341, name: "Blueprint_ Mini SMG" }, { id: 342, name: "Blueprint_ Lefűrészelt csövű" }, { id: 359, name: "Blueprint_ C4 Robbanótöltet" }, { id: 321, name: "Blueprint_ Kokain (50g)" }, { id: 322, name: "Blueprint_ Marihuána (50g)" }, { id: 323, name: "Blueprint_ Meth (50g)" }, { id: 324, name: "Blueprint_ LSD_vel átitatott bélyegív" }
    ]
  },
  {
    id: "drugs", name: "Drogok, Vegyszerek & Labor", color: "#a78bfa",
    items: [
      { id: 187, name: "LSD bélyeg" }, { id: 188, name: "Joint" }, { id: 197, name: "Kokain (2g)" }, { id: 198, name: "Marihuána (2g)" }, { id: 199, name: "Meth (2g)" }, { id: 200, name: "Üveg pipa" }, { id: 201, name: "Üveg pipa kokainnal" }, { id: 289, name: "Kannabisz bibe" }, { id: 293, name: "Marihuána (50g)" }, { id: 294, name: "Kokain (50g)" }, { id: 295, name: "Meth (50g)" }, { id: 304, name: "LSD-vel átitatott bélyegív" }, { id: 306, name: "Bélyegív" },
      { id: 296, name: "Aceton" }, { id: 297, name: "Hidrogén-Peroxid" }, { id: 298, name: "Lombik" }, { id: 299, name: "Sebbenzin" }, { id: 300, name: "Tálca" }, { id: 301, name: "Pszeudoefedrin" }, { id: 302, name: "Lizergsav" }, { id: 303, name: "Dietil-amin" }, { id: 305, name: "UV lámpa" }, { id: 307, name: "A kis kémikus kezdőszett" }, { id: 266, name: "Vegyszeres kanna" }
    ]
  },
  {
    id: "farming", name: "Mezőgazdaság & Termények", color: "#4ade80",
    items: [
      { id: 220, name: "Paradicsom vetőmag" }, { id: 224, name: "Málna vetőmag" }, { id: 270, name: "Eper vetőmag" }, { id: 271, name: "Sütőtök vetőmag" }, { id: 272, name: "Görögdinnye vetőmag" }, { id: 273, name: "Sárgadinnye vetőmag" }, { id: 274, name: "Uborka vetőmag" }, { id: 275, name: "TV paprika vetőmag" }, { id: 276, name: "Chilipaprika vetőmag" }, { id: 277, name: "Almapaprika vetőmag" }, { id: 286, name: "Kokacserje vetőmag" }, { id: 287, name: "Kannabisz vetőmag" }, { id: 431, name: "Kokacserje vetőmag csomag" }, { id: 432, name: "Kannabisz vetőmag csomag" }, { id: 288, name: "Kokacserje levél" }, { id: 451, name: "Kokacserje levél köteg" },
      { id: 191, name: "Alma" }, { id: 222, name: "Paradicsom" }, { id: 225, name: "Málna" }, { id: 278, name: "Eper" }, { id: 279, name: "Sütőtök" }, { id: 280, name: "Görögdinnye" }, { id: 281, name: "Sárgadinnye" }, { id: 282, name: "Uborka" }, { id: 283, name: "TV paprika" }, { id: 284, name: "Chilipaprika" }, { id: 285, name: "Almapaprika" }, { id: 419, name: "Narancs" }, { id: 420, name: "Banán" }
    ]
  },
  {
    id: "food", name: "Ételek, Italok & Dohányáru", color: "#facc15",
    items: [
      { id: 5, name: "Meteorite csokoládé" }, { id: 15, name: "Hamburger (dobozban)" }, { id: 17, name: "Sültkrumpli" }, { id: 18, name: "Hamburger" }, { id: 19, name: "Kenyér (1kg)" }, { id: 31, name: "Csokis fánk" }, { id: 152, name: "Egy szelet kenyér" }, { id: 180, name: "Zala felvágott" }, { id: 192, name: "Szendvics" }, { id: 203, name: "Parizer" }, { id: 204, name: "Kenyér (0.5kg)" }, { id: 403, name: "Taco" }, { id: 404, name: "Hot-Dog" }, { id: 405, name: "Vaníliás fánk" }, { id: 406, name: "Sült pulykacomb" }, { id: 441, name: "Ostya" }, { id: 442, name: "Ostya (csomag)" }, { id: 443, name: "Egy tányér főtt étel" }, { id: 444, name: "Több adag főtt étel" },
      { id: 4, name: "Tej" }, { id: 8, name: "Sprunk (dobozos)" }, { id: 9, name: "E-Cola (dobozos)" }, { id: 189, name: "Kávé" }, { id: 415, name: "Rainé ásványvíz" }, { id: 416, name: "Flow sportital" }, { id: 417, name: "Coco Motion tejital" }, { id: 418, name: "Junk Energy Drink" }, { id: 421, name: "E-Cola (0.5L)" }, { id: 422, name: "E-Tonic Light (0.5L)" }, { id: 445, name: "Sprunk (tálca)" }, { id: 446, name: "E-Cola (tálca)" },
      { id: 14, name: "Barracho" }, { id: 407, name: "Syrah vörösbor" }, { id: 408, name: "Two Roosters rozé" }, { id: 409, name: "Bleuter'D pezsgő" }, { id: 410, name: "The Mount Bourbon Whiskey" }, { id: 411, name: "Vinewood Sauvignon Blanc fehérbor" }, { id: 412, name: "Cherenkov Premium Vodka" }, { id: 413, name: "Cazafortunas Tequila" }, { id: 414, name: "Sinsimito Tequila" }, { id: 423, name: "Ragga rum" }, { id: 447, name: "Vinewood Sauvignon Blanc fehérbor (doboz)" }, { id: 448, name: "Syrah vörösbor (doboz)" }, { id: 449, name: "Cherenkov Premium Vodka (doboz)" }, { id: 450, name: "Kőbaltás (rekesz)" }, { id: 3, name: "Kőbaltás" },
      { id: 10, name: "Redwood" }, { id: 11, name: "Egy szál cigi" }, { id: 16, name: "Öngyújtó" }, { id: 153, name: "Ezüst öngyújtó" }, { id: 154, name: "Arany öngyújtó" }, { id: 194, name: "Cigipapír csomag" }, { id: 195, name: "Cigipapír" }
    ]
  },
  {
    id: "health", name: "Egészségügy & Gyógyszerek", color: "#ec4899",
    items: [
      { id: 12, name: "Gyógyszer" }, { id: 13, name: "Tabletta (gyógyszer)" }, { id: 144, name: "Üres fecskendő" }, { id: 145, name: "Szteroid injekció" }, { id: 146, name: "Horse Power Szteroid" }, { id: 169, name: "Elsősegély táska" }, { id: 183, name: "Vényköteles gyógyszer" }, { id: 184, name: "Tabletta (Vényköteles gyógyszer)" }, { id: 185, name: "Vitamin" }, { id: 186, name: "Kapszula (Vitamin)" }, { id: 351, name: "Kötszeres doboz" }, { id: 364, name: "Kötszer" }
    ]
  },
  {
    id: "boosters", name: "Prémium kártyák & Boosterek", color: "#00b0f4",
    items: [
      { id: 390, name: "+500 Állóképesség skill kártya" }, { id: 391, name: "+500 Erő skill kártya" }, { id: 392, name: "+500 Tüdőkapacitás skill kártya" }, { id: 393, name: "+500 Vitalitás skill kártya" }, { id: 394, name: "+500 Vezetés skill kártya" }, { id: 395, name: "+500 Repülés skill kártya" }, { id: 396, name: "+500 Lövés skill kártya" }, { id: 397, name: "+500 Futár skill kártya" }, { id: 398, name: "+500 Buszsofőr skill kártya" }, { id: 459, name: "+500 Horgászat skill kártya" },
      { id: 140, name: "Fegyverjavító kártya" }, { id: 372, name: "Instant fixkártya" }, { id: 373, name: "Instant gyógyítás kártya" }, { id: 374, name: "Instant respawn kártya" }, { id: 375, name: "Extra respawn kártya" }, { id: 376, name: "Instant járműtisztító kártya" }, { id: 427, name: "Instant üzemanyagkártya" }, { id: 433, name: "Instant unflip kártya" },
      { id: 377, name: "Ezüst SeeRPG Club tagság aktiváló (7 nap)" }, { id: 381, name: "Ezüst SeeRPG Club tagság aktiváló (24 óra)" }, { id: 378, name: "Arany SeeRPG Club tagság aktiváló (7 nap)" }, { id: 382, name: "Arany SeeRPG Club tagság aktiváló (24 óra)" }, { id: 379, name: "Gyémánt SeeRPG Club tagság aktiváló (7 nap)" }, { id: 383, name: "Gyémánt SeeRPG Club tagság aktiváló (24 óra)" }, { id: 380, name: "Smaragd SeeRPG Club tagság aktiváló (7 nap)" }, { id: 384, name: "Smaragd SeeRPG Club tagság aktiváló (24 óra)" },
      { id: 385, name: "Óránkénti SP boost (12 óra)" }, { id: 386, name: "Munka fizetés boost (12 óra)" }, { id: 387, name: "Skill fejlődés boost (12 óra)" }, { id: 388, name: "Monthly Pass XP boost (12 óra)" }, { id: 389, name: "Monthly Pass Premium aktiváló" }
    ]
  },
  {
    id: "antiques", name: "Antik tárgyak & Ékszerek", color: "#eeb32a",
    items: [
      { id: 229, name: "Aranyrúd" }, { id: 230, name: "Festett ezüst kupa" }, { id: 231, name: "Ezüst hamutál" }, { id: 232, name: "Ezüstrudak" }, { id: 233, name: "Aranyóra" }, { id: 234, name: "Antik bronz doboz" }, { id: 235, name: "Arany hamutál" }, { id: 236, name: "Arany nagydíj" }, { id: 237, name: "Arany kupa" }, { id: 238, name: "Koponya" }, { id: 239, name: "Ezüst szobor" }, { id: 240, name: "Arany érme" }, { id: 241, name: "Ezüst villa" }, { id: 242, name: "Arany karkötő" }, { id: 243, name: "Arany szaxofon" }, { id: 244, name: "Háborús sisak" }, { id: 245, name: "Antik filmtekercs" }, { id: 399, name: "Gyémánt amulett" }, { id: 400, name: "Smaragd amulett" }, { id: 401, name: "Mellszobor" }, { id: 402, name: "Flamingó szobor" }
    ]
  },
  {
    id: "tools", name: "Szerszámok, Rendvédelem & Egyéb", color: "#6b7280",
    items: [
      { id: 227, name: "Fémdetektor" }, { id: 228, name: "Ásó" }, { id: 251, name: "Villáskulcs" }, { id: 252, name: "Fogó" }, { id: 268, name: "Véső" }, { id: 269, name: "Csavarhúzó" }, { id: 315, name: "Kalapács" }, { id: 337, name: "Fúrószár" }, { id: 338, name: "Fúrószár készlet" }, { id: 356, name: "Szigetelőszalag" }, { id: 360, name: "Fúrógép" },
      { id: 175, name: "Bilincs" }, { id: 176, name: "Bilincs kulcs" }, { id: 217, name: "Jelvény" }, { id: 218, name: "Névkitűző" }, { id: 219, name: "Lezáró szalag" }, { id: 361, name: "Golyóálló mellény" }, { id: 424, name: "Alkoholszonda" }, { id: 425, name: "Drog gyorsteszt doboz" }, { id: 426, name: "Drog gyorsteszt" }, { id: 429, name: "Szögesdrót" },
      { id: 202, name: "Sörnyitó" }, { id: 247, name: "Edény" }, { id: 255, name: "Edény" }, { id: 256, name: "Edény" }, { id: 257, name: "Serpenyő" }, { id: 258, name: "Wok" }, { id: 261, name: "Sajtreszelő" }, { id: 262, name: "Merőkanál" }, { id: 263, name: "Habverő" }, { id: 267, name: "Vödör" }, { id: 246, name: "Felni" }, { id: 248, name: "Kipufogódob" }, { id: 249, name: "Motor kipufogódob" }, { id: 264, name: "Olajos kanna" }, { id: 265, name: "Festékesvödör" }, { id: 363, name: "Viteldíj számláló" },
      { id: 196, name: "Üres zacskó (S)" }, { id: 349, name: "Üres zacskó (M)" }, { id: 250, name: "Üdítősdoboz" }, { id: 253, name: "Lánc" }, { id: 254, name: "Sodronykötél" }, { id: 260, name: "Rozsdás kanna" }, { id: 362, name: "Zsák" }
    ]
  }
];

const itemDictionary = {};
itemCategories.forEach(cat => cat.items.forEach(item => {
  itemDictionary[`item_${item.id}`] = item;
}));

const generateInitialLoot = () => {
  const initial = {};
  itemCategories.forEach(cat => {
    cat.items.forEach(item => {
      initial[`item_${item.id}`] = 0;
    });
  });
  return initial;
};

export default function HalloweenLoot() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCats, setExpandedCats] = useState({});
  const [showRecentOpens, setShowRecentOpens] = useState(true);

  const [loot, setLoot] = useState(generateInitialLoot());
  const [recentOpens, setRecentOpens] = useState([]);

  // --- FIREBASE: BIZTONSÁGOS LETÖLTÉS (GOLYÓÁLLÓ) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "lootbox", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Kőkemény tisztítás: Bármi jön, csak számként fogadjuk el!
            if (data.loot && typeof data.loot === 'object') {
              setLoot(prev => {
                const safeLoot = { ...prev };
                Object.keys(data.loot).forEach(key => {
                  safeLoot[key] = Number(data.loot[key]) || 0;
                });
                return safeLoot;
              });
            }
            
            if (data.recentOpens && Array.isArray(data.recentOpens)) {
              setRecentOpens(data.recentOpens.filter(item => typeof item === 'string'));
            }
          }
        } catch (error) {
          console.error("Firebase betöltési hiba:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- FIREBASE: AUTOMATIKUS MENTÉS ---
  useEffect(() => {
    if (user && !loading) {
      const saveData = async () => {
        try {
          const docRef = doc(db, "lootbox", user.uid);
          await setDoc(docRef, { loot, recentOpens }, { merge: true });
        } catch (error) {
          console.error("Hiba a mentésnél:", error);
        }
      };
      saveData();
    }
  }, [loot, recentOpens, user, loading]);

  const handleIncrement = (idKey) => {
    setLoot((prev) => ({ ...prev, [idKey]: (Number(prev[idKey]) || 0) + 1 }));
    setRecentOpens((prev) => [idKey, ...prev].slice(0, 8));
  };

  const handleDecrement = (idKey) => {
    if (loot[idKey] > 0) {
      setLoot((prev) => ({ ...prev, [idKey]: Math.max(0, (Number(prev[idKey]) || 0) - 1) }));
      setRecentOpens((prev) => {
        const index = prev.indexOf(idKey);
        if (index !== -1) {
          const newRecent = [...prev];
          newRecent.splice(index, 1);
          return newRecent;
        }
        return prev;
      });
    }
  };

  const handleReset = () => {
    if (window.confirm("Biztosan lenullázod az eddigi összes nyitást?")) {
      setLoot(generateInitialLoot());
      setRecentOpens([]);
    }
  };

  const toggleCategory = (catId) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Hibatűrő számítások
  const totalOpened = Object.values(loot).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  const filteredCategories = itemCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toString().includes(searchTerm)
    )
  })).filter(cat => cat.items.length > 0);

  const openedItemsList = Object.entries(loot)
    .filter(([idKey, count]) => (Number(count) || 0) > 0 && itemDictionary[idKey])
    .map(([idKey, count]) => ({ ...itemDictionary[idKey], count: Number(count), idKey }));

  // --- STÍLUSOK ---
  const styles = {
    container: { position: "relative", boxSizing: "border-box", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#111216", color: "#d1d5db", padding: "100px 20px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" },
    navbar: { position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(17, 18, 22, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 },
    logo: { fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', color: '#eeb32a', textShadow: '0 0 10px rgba(238, 179, 42, 0.3)', cursor: 'pointer', userSelect: 'none' },
    authBtn: { padding: '8px 15px', backgroundColor: '#00b0f4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' },
    logoutBtn: { padding: '8px 15px', backgroundColor: 'transparent', color: '#ff4a4a', border: '1px solid #ff4a4a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    titleContainer: { textAlign: "center", marginBottom: "20px", marginTop: "10px" },
    titleMain: { color: "#a78bfa", textShadow: "0 0 15px rgba(167, 139, 250, 0.4)", fontSize: "2.8rem", fontWeight: "900", letterSpacing: "1px", margin: 0 },
    
    searchContainer: { display: 'flex', flexWrap: 'wrap', gap: '15px', width: '100%', maxWidth: '1000px', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' },
    searchInput: { flex: 1, minWidth: '250px', padding: '14px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#15171c', color: '#fff', fontSize: '1.1rem', outline: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#a1a5ab', fontSize: '1rem', backgroundColor: '#1e2128', padding: '12px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
    
    recentPanel: { width: '100%', maxWidth: '1000px', backgroundColor: '#1e2128', borderRadius: '12px', padding: '20px', marginBottom: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', borderTop: '4px solid #4ade80' },
    recentTitle: { margin: '0 0 15px 0', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' },
    recentGrid: { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' },
    recentCard: { backgroundColor: '#15171c', borderRadius: '10px', padding: '10px', minWidth: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' },
    recentImg: { width: '45px', height: '45px', objectFit: 'contain', marginBottom: '8px' },
    addBtnOverlay: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px', color: '#a1a5ab', width: '100%', padding: '4px 0', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' },

    categoryContainer: { width: '100%', maxWidth: '1000px', marginBottom: '15px' },
    categoryHeader: (isOpen, color) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: isOpen ? '#1e2128' : '#15171c', borderLeft: `5px solid ${color}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease', userSelect: 'none' }),
    categoryTitle: { margin: 0, fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
    
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", padding: "20px 0", marginTop: "5px" },
    
    itemCard: { backgroundColor: "#15171c", padding: "12px 10px", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
    itemImage: { width: "60px", height: "60px", objectFit: "contain", dropShadow: "0 5px 10px rgba(0,0,0,0.5)" },
    itemName: { fontSize: "0.8rem", fontWeight: "600", color: "#a1a5ab", margin: 0, minHeight: "32px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" },
    
    counterRow: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", backgroundColor: "#1e2128", borderRadius: "6px", padding: "2px 6px", marginTop: "auto" },
    btnStyle: { backgroundColor: "transparent", border: "none", color: "#8b929e", fontSize: "1.1rem", cursor: "pointer", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s" },
    countBox: { fontSize: "1.1rem", fontWeight: "bold", color: "#fff", margin: "0 5px" },
    
    summaryCard: { backgroundColor: "#1e2128", borderTop: "5px solid #eeb32a", padding: "20px", borderRadius: "12px", width: "100%", maxWidth: "800px", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.4)", marginTop: "20px" },
    resetBtn: { marginTop: "15px", padding: "8px 18px", backgroundColor: "transparent", color: "#ff4a4a", border: "1px solid #ff4a4a", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
    
    inventoryContainer: { width: '100%', maxWidth: '1000px', marginTop: '40px', backgroundColor: '#15171c', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
    inventoryGrid: { display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: '15px' },
    inventoryItemBox: { position: 'relative', width: '65px', height: '65px', backgroundColor: '#1e2128', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' },
    inventoryBadge: { position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#9ca3af', color: '#000', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }
  };

  if (loading) return <div style={{...styles.container, justifyContent: 'center'}}><h2>Adatok betöltése...</h2></div>;

  return (
    <div style={styles.container}>
      
      <div style={styles.navbar}>
        <div onClick={() => navigate('/')} style={styles.logo}>BARNI-SEERPG</div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: '#a1a5ab', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Bejelentkezve: <b style={{ color: '#a78bfa', fontSize: '1rem', marginLeft: '5px' }}>
                    {user?.email ? String(user.email).split('@')[0] : 'Játékos'}
                  </b>
                </span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>Kijelentkezés</button>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} style={styles.authBtn}>Bejelentkezés</button>
          )}
        </div>
      </div>

      <div style={styles.titleContainer}>
        <h1 style={styles.titleMain}>Ládanyitás Logger</h1>
      </div>

      <div style={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Keresés név vagy ID alapján (pl. fánk, 308)..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={styles.searchInput} 
        />
        <label style={styles.checkboxLabel}>
          <input 
            type="checkbox" 
            checked={showRecentOpens} 
            onChange={(e) => setShowRecentOpens(e.target.checked)} 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          Utolsó nyitások mutatása
        </label>
      </div>

      {showRecentOpens && recentOpens.length > 0 && (
        <div style={styles.recentPanel}>
          <h3 style={styles.recentTitle}>Utolsó megnyitott tárgyak</h3>
          <div style={styles.recentGrid}>
            {recentOpens.map((idKey, index) => {
              const item = itemDictionary[idKey];
              if (!item) return null;
              return (
                <div key={`recent_${idKey}_${index}`} style={styles.recentCard}>
                  <img 
                    src={`/items/${item.id}_${item.name.replace(/[\/\\:*?"<>|]/g, '_')}.png`} 
                    alt={item.name} 
                    style={styles.recentImg} 
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                  <button 
                    onClick={() => handleIncrement(idKey)} 
                    style={styles.addBtnOverlay}
                    onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#4ade80'; }}
                    onMouseOut={(e) => { e.target.style.color = '#a1a5ab'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  >
                    +1
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredCategories.length === 0 ? (
        <h3 style={{ color: "#ff4a4a" }}>Nincs találat a keresésre.</h3>
      ) : (
        filteredCategories.map((cat) => {
          const isOpen = searchTerm !== "" || expandedCats[cat.id];
          
          return (
            <div key={cat.id} style={styles.categoryContainer}>
              <div style={styles.categoryHeader(isOpen, cat.color)} onClick={() => toggleCategory(cat.id)}>
                <h2 style={styles.categoryTitle}>
                  {cat.name}
                </h2>
                <span style={{ color: '#a1a5ab', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                  ▼
                </span>
              </div>

              {isOpen && (
                <div style={styles.grid}>
                  {cat.items.map((item) => {
                    const idKey = `item_${item.id}`;
                    return (
                      <div key={idKey} style={styles.itemCard}>
                        <img 
                          src={`/items/${item.id}_${item.name.replace(/[\/\\:*?"<>|]/g, '_')}.png`} 
                          alt={item.name} 
                          style={styles.itemImage} 
                          onError={(e) => { e.target.style.display = 'none'; }} 
                        />
                        <h3 style={styles.itemName}>{item.name}</h3>
                        
                        <div style={styles.counterRow}>
                          <button 
                            onClick={() => handleDecrement(idKey)} 
                            style={styles.btnStyle}
                            onMouseOver={(e) => e.target.style.color = '#ff4a4a'}
                            onMouseOut={(e) => e.target.style.color = '#8b929e'}
                          >
                            −
                          </button>
                          <div style={styles.countBox}>{Number(loot[idKey]) || 0}</div>
                          <button 
                            onClick={() => handleIncrement(idKey)} 
                            style={styles.btnStyle}
                            onMouseOver={(e) => e.target.style.color = '#4ade80'}
                            onMouseOut={(e) => e.target.style.color = '#8b929e'}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      <div style={styles.summaryCard}>
        <p style={{ fontSize: "1.1rem", color: "#b9bbbe", margin: 0 }}>
          Eddig kinyitott ládák száma: <b style={{ color: "white", fontSize: "1.4rem", marginLeft: "8px" }}>{totalOpened} db</b>
        </p>
        <button onClick={handleReset} style={styles.resetBtn}>
          Nyitások Lenullázása
        </button>
      </div>

      {openedItemsList.length > 0 && (
        <div style={styles.inventoryContainer}>
          <h3 style={{ margin: '0 0 10px 0', color: '#eeb32a', textAlign: 'center', fontSize: '1.2rem', textTransform: 'uppercase' }}>
            Eddig Kinyitott Tárgyaid
          </h3>
          <div style={styles.inventoryGrid}>
            {openedItemsList.map(item => (
              <div key={`inv_${item.idKey}`} style={styles.inventoryItemBox}>
                <img 
                  src={`/items/${item.id}_${item.name.replace(/[\/\\:*?"<>|]/g, '_')}.png`} 
                  alt={item.name} 
                  style={{ width: '45px', height: '45px', objectFit: 'contain' }} 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
                <div style={styles.inventoryBadge}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}