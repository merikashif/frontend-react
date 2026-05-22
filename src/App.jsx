//KASHIF
// Importa gli hook useEffect e useState da React
// useState serve per creare variabili dinamiche
// useEffect serve per eseguire funzioni automatiche quando la pagina si carica
import { useEffect, useState } from "react";
// Importa il file CSS principale del progetto
// Contiene tutta la grafica del sito
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import MapView from "./MapView"

function Navbar({ user, onLogout, onShowAbout, onToggleBookings, onLogin }) {

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Navbar principale del sito
// Contiene logo e menu di navigazione
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
//PARTE AMATO

// Componente principale dell'applicazione
function App() {

  /* ================= STATE ================= */

  // Stato che contiene tutti i parcheggi
  // setParcheggi serve per aggiornarli
  const [parcheggi, setParcheggi] = useState([]);

  // Stato che contiene tutte le prenotazioni
  const [prenotazioni, setPrenotazioni] = useState([]);

  // Stato dell’utente loggato
  // null significa nessun utente connesso
  const [user, setUser] = useState(null);

  // Stato per mostrare o nascondere il login
  const [showLogin, setShowLogin] = useState(false);

  // Stato per mostrare le prenotazioni
  const [showBookings, setShowBookings] = useState(false);

  // Stato per mostrare la finestra "Chi siamo"
  const [showAbout, setShowAbout] = useState(false);

  // Contiene il parcheggio selezionato dall’utente
  const [selectedParking, setSelectedParking] = useState(null);

  // Mostra o nasconde i dettagli della prenotazione
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Data di ingresso del parcheggio
  const [entryDate, setEntryDate] = useState("");

  // Data di uscita del parcheggio
  const [exitDate, setExitDate] = useState("");

  // Prezzo finale della prenotazione
  const [bookingPrice, setBookingPrice] = useState(0);

  // Stato per mostrare o nascondere la mappa
  const [showMap, setShowMap] = useState(false);

  /* ================= UTENTI ================= */

  // Lista utenti finti usati per il login
  // Simulano utenti presenti nel database
  const fakeUsers = [

    // Account amministratore
    {
      id: 1,

      // Nome visualizzato
      nome: "Amministratore",

      // Username login
      email: "admin",

      // Password login
      password: "admin123",

      // Ruolo amministratore
      ruolo: "admin"
    },

    // Primo utente normale
    {
      id: 2,

      nome: "Mario Rossi",

      email: "mario",

      password: "user123",

      // Ruolo utente standard
      ruolo: "utente"
    },

    // Secondo utente normale
    {
      id: 3,

      nome: "Giulia Bianchi",

      email: "giulia",

      password: "user123",

      ruolo: "utente"
    }
  ];

  /* ================= PARCHEGGI ================= */

  // useEffect esegue il codice automaticamente
  // quando il componente viene caricato
  useEffect(() => {

    // fetch invia una richiesta al server PHP
    // per recuperare i parcheggi dal database MySQL
    fetch("http://localhost/parking-apii/parcheggi.php")

      // Trasforma la risposta in formato JSON
      .then(res => res.json())

      // Salva i dati ricevuti nello stato parcheggi
      .then(data => setParcheggi(data))

      // Se il server non funziona entra nel catch
      .catch(() => {

        // Inserisce parcheggi locali di emergenza
        setParcheggi([

          {
            id: 1,
            nome: "Centro Brescia",
            indirizzo: "Via Roma",
            posti_liberi: 40
          },

          {
            id: 2,
            nome: "Stazione",
            indirizzo: "Via Stazione",
            posti_liberi: 10
          },

          {
            id: 3,
            nome: "Ospedale",
            indirizzo: "Via Ospedale",
            posti_liberi: 25
          }

        ]);
      });

  // Array vuoto = esegue useEffect una sola volta
  }, []);
//PARTE THIND
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

    if (!user) {
      return setShowLogin(true);
    }

    if (user.ruolo === "admin") {
      alert("Gli amministratori non possono prenotare");
      return;
    }

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

    localStorage.setItem(
      "prenotazioni",
      JSON.stringify(updated)
    );

    setShowBookingDetails(false);
  };
//FENOTTI
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
        <section id="dashboard" className="map-section">

          <h2> Dashboard Admin</h2>

          <AdminDashboard
            parcheggi={parcheggi}
            prenotazioni={prenotazioni}
          />

        </section>
      )}

      {/* MAPPA */}
      <section id="mappa" className="section-block">

        <h2>🗺️ Mappa parcheggi</h2>

        {!showMap ? (

          <button
            className="open-map-btn"
            onClick={() => setShowMap(true)}
          >
            Apri mappa
          </button>

        ) : (

          <>
            <div className="map-wrapper">
              <MapView />
            </div>

            <button
              className="close-map-btn"
              onClick={() => setShowMap(false)}
            >
              Chiudi mappa
            </button>
          </>

        )}

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

            <button onClick={() => setShowAbout(false)}>
              Chiudi
            </button>

          </div>

        </div>

      )}

      {/* LOGIN */}
      {showLogin && (

        <div className="modal">

          <div className="modal-content">

            <h2>Login</h2>

            <p style={{ marginBottom: "15px", color: "#666" }}>
              Accedi al tuo account
            </p>

            <input
              id="email"
              placeholder="Username"
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
            />

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

            <button onClick={() => setShowLogin(false)}>
              Chiudi
            </button>

          </div>

        </div>

      )}

      {/* PRENOTAZIONE */}
      {showBookingDetails && selectedParking && (

        <div className="modal">

          <div className="modal-content">

            <h2>{selectedParking.nome}</h2>

            <input
              type="date"
              onChange={e => setEntryDate(e.target.value)}
            />

            <input
              type="date"
              onChange={e => setExitDate(e.target.value)}
            />

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
