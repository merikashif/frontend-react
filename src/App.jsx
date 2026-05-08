import { useEffect, useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import MapView from "./MapView";

/* ================= NAVBAR ================= */
function Navbar({ user, onLogout, onShowAbout, onToggleBookings, onLogin }) {

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navbar-main">

      <div className="navbar-logo">
        🅿️ PotaPark
      </div>

      <ul className="navbar-menu">
        <li><button onClick={() => scrollTo("parcheggi")}>Parcheggi</button></li>
        <li><button onClick={() => scrollTo("mappa")}>Mappa</button></li>
        <li><button onClick={() => scrollTo("contatti")}>Contatti</button></li>
        <li><button onClick={onShowAbout}>Chi siamo</button></li>
        <li><button onClick={onToggleBookings}>Prenotazioni</button></li>
      </ul>

      <div className="navbar-auth">
        {user ? (
          <>
            👤 {user.nome}
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button onClick={onLogin}>Accedi</button>
        )}
      </div>

    </nav>
  );
}

/* ================= APP ================= */
function App() {

  /* STATE */
  const [parcheggi, setParcheggi] = useState([]);
  const [prenotazioni, setPrenotazioni] = useState([]);

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const [selectedParking, setSelectedParking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [bookingPrice, setBookingPrice] = useState(0);

  /* UTENTI FAKE */
  const fakeUsers = [
    { id: 1, nome: "Admin", email: "admin", password: "1234", ruolo: "admin" },
    { id: 2, nome: "Mario Rossi", email: "mario", password: "1234", ruolo: "utente" }
  ];

  /* PARCHEGGI */
  useEffect(() => {
    fetch("http://localhost/parking-apii/parcheggi.php")
      .then(res => res.json())
      .then(data => setParcheggi(data))
      .catch(() => {
        setParcheggi([
          { id: 1, nome: "Centro Brescia", indirizzo: "Via Roma", posti_liberi: 40 },
          { id: 2, nome: "Stazione", indirizzo: "Via Stazione", posti_liberi: 10 },
          { id: 3, nome: "Ospedale", indirizzo: "Via Ospedale", posti_liberi: 25 }
        ]);
      });
  }, []);

  /* LOCAL STORAGE */
  useEffect(() => {
    const saved = localStorage.getItem("prenotazioni");
    if (saved) setPrenotazioni(JSON.parse(saved));

    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  /* LOGIN */
  const handleLogin = (email, password) => {
    const found = fakeUsers.find(
      u => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      setShowLogin(false);
    } else {
      alert("Credenziali errate");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /* PRENOTAZIONE */
  const prenotaPosto = (p) => {
    if (!user) return setShowLogin(true);
    setSelectedParking(p);
    setShowBookingDetails(true);
  };

  const calcolaPrezzo = () => {
    const giorni =
      (new Date(exitDate) - new Date(entryDate)) / (1000 * 60 * 60 * 24);

    const prezzo = Math.max(5, giorni * 8);
    setBookingPrice(prezzo);
  };

  const confermaPrenotazione = () => {
    const pren = {
      id: Date.now(),
      parcheggio: selectedParking.nome,
      prezzo: bookingPrice,
      codice: Math.random().toString(36).substring(2, 8).toUpperCase(),
      userId: user.id
    };

    const updated = [...prenotazioni, pren];
    setPrenotazioni(updated);
    localStorage.setItem("prenotazioni", JSON.stringify(updated));

    setShowBookingDetails(false);
  };

  return (
    <>

      {/* NAVBAR */}
      <Navbar
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onToggleBookings={() => setShowBookings(!showBookings)}
        onShowAbout={() => setShowAbout(true)}
      />

      {/* ADMIN DASHBOARD */}
      {user?.ruolo === "admin" && (
        <section id="mappa" className="map-section">
          <h2>📊 Dashboard Admin</h2>
          <AdminDashboard
            parcheggi={parcheggi}
            prenotazioni={prenotazioni}
          />
        </section>
      )}

      {/* MAPPA */}
      <section id="mappa" className="section-block">
        <h2>🗺️ Mappa parcheggi</h2>
        <div className="map-wrapper">
          <MapView />
        </div>
      </section>

      {/* PARCHEGGI */}
      <div id="parcheggi" className="container">

        <h1>Parcheggi disponibili</h1>

        {showBookings && user && (
          <div className="box">
            <h2>Le mie prenotazioni</h2>

            {prenotazioni
              .filter(p => p.userId === user.id)
              .map(p => (
                <div key={p.id}>
                  {p.parcheggio} - €{p.prezzo} - 🔑 {p.codice}
                </div>
              ))}
          </div>
        )}

        <div className="cards">
          {parcheggi.map(p => (
            <div className="card" key={p.id}>
              <h2>{p.nome}</h2>
              <p>{p.indirizzo}</p>

              <p className={p.posti_liberi > 0 ? "green" : "red"}>
                {p.posti_liberi > 0 ? "Disponibile" : "Completo"}
              </p>

              <button onClick={() => prenotaPosto(p)}>
                Prenota
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CONTATTI */}
      <section id="contatti" className="section-block">
        <h2>Contatti</h2>
        <p>📍 Smart Parking Brescia</p>
        <p>📞 +39 333 456 7890</p>
        <p>📧 support@smartparking.it</p>
      </section>

      {/* ABOUT */}
      {showAbout && (
        <div className="modal">
          <div className="modal-content">
            <h2>Smart Parking Brescia</h2>
            <p>
              Sistema intelligente per la gestione dei parcheggi nella città di Brescia,
              con prenotazione online e riduzione traffico urbano.
            </p>
            <button onClick={() => setShowAbout(false)}>Chiudi</button>
          </div>
        </div>
      )}

      {/* LOGIN */}
      {showLogin && (
        <div className="modal">
          <div className="modal-content">

            <h2>Login</h2>

            <input id="email" placeholder="email" />
            <input id="password" placeholder="password" />

            <button
              onClick={() =>
                handleLogin(
                  document.getElementById("email").value,
                  document.getElementById("password").value
                )
              }
            >
              Accedi
            </button>

            <button onClick={() => setShowLogin(false)}>Chiudi</button>

          </div>
        </div>
      )}

      {/* PRENOTAZIONE */}
      {showBookingDetails && selectedParking && (
        <div className="modal">
          <div className="modal-content">

            <h2>{selectedParking.nome}</h2>

            <input type="date" onChange={e => setEntryDate(e.target.value)} />
            <input type="date" onChange={e => setExitDate(e.target.value)} />

            <button onClick={calcolaPrezzo}>
              Calcola prezzo
            </button>

            {bookingPrice > 0 && (
              <>
                <h3>€{bookingPrice}</h3>
                <button onClick={confermaPrenotazione}>
                  Conferma
                </button>
              </>
            )}

            <button onClick={() => setShowBookingDetails(false)}>
              Chiudi
            </button>

          </div>
        </div>
      )}

    </>
  );
}

export default App;