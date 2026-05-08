function ParkingCard({ parcheggio }) {
  const prenotaPosto = () => {
    const codice = "BRX-" + Math.floor(Math.random() * 100000);

    alert(
      `Prenotazione confermata!\n${parcheggio.nome}\nCodice: ${codice}`
    );
  };

  return (
    <div className="card">
      <h2>{parcheggio.nome}</h2>

      <p>
        <strong>Indirizzo:</strong> {parcheggio.indirizzo}
      </p>

      <p>
        <strong>Posti totali:</strong> {parcheggio.posti_totali}
      </p>

      <p>
        <strong>Posti liberi:</strong> {parcheggio.posti_liberi}
      </p>

      <p>
        <strong>Stato:</strong> {parcheggio.stato}
      </p>

      <button onClick={prenotaPosto}>
        Prenota posto
      </button>
    </div>
  );
}

export default ParkingCard;