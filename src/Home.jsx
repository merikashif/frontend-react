import { useEffect, useState } from "react";
import ParkingCard from "../components/ParkingCard";

function Home() {
  const [parcheggi, setParcheggi] = useState([]);

  useEffect(() => {
    fetch("http://localhost/parking-apii/parcheggi.php")
      .then((response) => response.json())
      .then((data) => setParcheggi(data))
      .catch((error) => console.log("Errore:", error));
  }, []);

  return (
    <div className="container">
      <h1>Smart Parking Brescia</h1>

      <div className="grid">
        {parcheggi.map((parcheggio) => (
          <ParkingCard
            key={parcheggio.id}
            parcheggio={parcheggio}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;