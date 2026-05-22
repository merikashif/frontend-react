// Importiamo la libreria Recharts
// Recharts serve per creare grafici interattivi in React
// È stata usata nella dashboard admin per mostrare statistiche e dati
import {
  BarChart, // Grafico a barre
  Bar, // Barre del grafico
  XAxis, // Asse orizzontale
  YAxis, // Asse verticale
  Tooltip, // Finestra info quando passi sopra il grafico
  ResponsiveContainer, // Rende il grafico responsive
  PieChart, // Grafico a torta
  Pie, // Parte principale del grafico a torta
  Cell, // Colori delle sezioni del grafico
  CartesianGrid, // Griglia del grafico
  Legend, // Legenda del grafico
  AreaChart, // Grafico ad area
  Area // Area colorata del grafico
} from "recharts";
function AdminDashboard({ prenotazioni, parcheggi }) {

  /* ================= DATI BARRE ================= */

  const dataBar = parcheggi.map(p => ({
    nome: p.nome,
    utilizzo: p.posti_totali - p.posti_liberi,
    liberi: p.posti_liberi
  }));

  /* ================= DATI TORTA ================= */

  const totaleLiberi = parcheggi.reduce(
    (acc, p) => acc + p.posti_liberi,
    0
  );

  const totaleOccupati = parcheggi.reduce(
    (acc, p) => acc + (p.posti_totali - p.posti_liberi),
    0
  );

  const dataPie = [
    {
      name: "Posti Liberi",
      value: totaleLiberi
    },

    {
      name: "Posti Occupati",
      value: totaleOccupati
    }
  ];

  /* ================= DATI TREND ================= */

  const trendData = [
    { giorno: "Lun", prenotazioni: 12 },
    { giorno: "Mar", prenotazioni: 18 },
    { giorno: "Mer", prenotazioni: 15 },
    { giorno: "Gio", prenotazioni: 24 },
    { giorno: "Ven", prenotazioni: 30 },
    { giorno: "Sab", prenotazioni: 20 },
    { giorno: "Dom", prenotazioni: 10 }
  ];

  /* ================= COLORI ================= */

  const COLORS = [
    "#2563eb",
    "#60a5fa"
  ];

  return (

    <div className="admin-dashboard">

      <h1 className="dashboard-title">
        Dashboard Admin
      </h1>

      {/* ================= KPI ================= */}

      <div className="dashboard-kpi">

        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <span>Totale prenotazioni</span>
          </div>

          <h2>{prenotazioni.length}</h2>

          <p className="dashboard-sub">
            Prenotazioni effettuate oggi
          </p>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <span>CO₂ risparmiata</span>
          </div>

          <h2>
            {(prenotazioni.length * 1.5).toFixed(1)} kg
          </h2>

          <p className="dashboard-sub">
            Riduzione traffico urbano
          </p>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <span>Parcheggi attivi</span>
          </div>

          <h2>{parcheggi.length}</h2>

          <p className="dashboard-sub">
            Gestiti dal sistema
          </p>

        </div>

      </div>

      {/* ================= GRAFICI ================= */}

      <div className="dashboard-grid">

        {/* BAR CHART */}

        <div className="dashboard-box">

          <h3>Utilizzo parcheggi</h3>

          <ResponsiveContainer width="100%" height={320}>

            <BarChart data={dataBar}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="nome" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="utilizzo"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />

              <Bar
                dataKey="liberi"
                fill="#93c5fd"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div className="dashboard-box">

          <h3>Occupazione totale</h3>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
                data={dataPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={4}
              >

                {dataPie.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= TREND ================= */}

      <div className="dashboard-box">

        <h3>Trend prenotazioni settimanali</h3>

        <ResponsiveContainer width="100%" height={320}>

          <AreaChart data={trendData}>

            <defs>

              <linearGradient
                id="colorPren"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="giorno" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="prenotazioni"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorPren)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}

export default AdminDashboard;
