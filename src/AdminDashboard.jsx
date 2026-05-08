import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

function AdminDashboard({ prenotazioni, parcheggi }) {

  // 📊 dati utilizzo parcheggi (fake ma realistici)
  const dataBar = parcheggi.map(p => ({
    nome: p.nome,
    utilizzo: p.posti_totali - p.posti_liberi
  }));

  // 🟢 torta occupazione totale
  const totaleLiberi = parcheggi.reduce((acc, p) => acc + p.posti_liberi, 0);
  const totaleOccupati = parcheggi.reduce(
    (acc, p) => acc + (p.posti_totali - p.posti_liberi), 0
  );

  const dataPie = [
    { name: "Liberi", value: totaleLiberi },
    { name: "Occupati", value: totaleOccupati }
  ];

  return (
    <div className="container">
      <h1>Dashboard Admin</h1>

      {/* KPI */}
      <div className="cards">
        <div className="card">
          <h3>Prenotazioni</h3>
          <p>{prenotazioni.length}</p>
        </div>

        <div className="card">
          <h3>CO₂ risparmiata</h3>
          <p>{(prenotazioni.length * 1.5).toFixed(1)} kg</p>
        </div>
      </div>

      {/* GRAFICO BARRE */}
      <div className="box">
        <h3>Utilizzo parcheggi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataBar}>
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="utilizzo" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* GRAFICO TORTA */}
      <div className="box">
        <h3>Occupazione totale</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataPie}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              <Cell />
              <Cell />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;