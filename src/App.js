import { useState, useEffect } from "react";

const sensors = [
  { id: 1, name: "Temperature", unit: "°C", min: 20, max: 35 },
  { id: 2, name: "Humidity",    unit: "%",  min: 40, max: 80 },
  { id: 3, name: "Pressure",    unit: "hPa",min: 995, max: 1015 },
  { id: 4, name: "CO2 Level",   unit: "ppm",min: 400, max: 800 },
];

function randomValue(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function SensorCard({ sensor }) {
  const [value, setValue] = useState(randomValue(sensor.min, sensor.max));
  const [status, setStatus] = useState("normal");

  useEffect(() => {
    const interval = setInterval(() => {
      const val = parseFloat(randomValue(sensor.min, sensor.max));
      setValue(val.toFixed(1));
      const mid = (sensor.min + sensor.max) / 2;
      const range = (sensor.max - sensor.min) / 2;
      setStatus(Math.abs(val - mid) > range * 0.7 ? "warning" : "normal");
    }, 2000);
    return () => clearInterval(interval);
  }, [sensor]);

  return (
    <div style={{
      background: status === "warning" ? "#fff3cd" : "#d4edda",
      border: `2px solid ${status === "warning" ? "#ffc107" : "#28a745"}`,
      borderRadius: "12px", padding: "20px", textAlign: "center",
      minWidth: "180px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ margin: "0 0 10px", color: "#333" }}>{sensor.name}</h3>
      <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0",
        color: status === "warning" ? "#856404" : "#155724" }}>
        {value}
      </p>
      <p style={{ margin: "5px 0 0", color: "#666" }}>{sensor.unit}</p>
      <span style={{
        display: "inline-block", marginTop: "10px", padding: "3px 10px",
        borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold",
        background: status === "warning" ? "#ffc107" : "#28a745", color: "white"
      }}>
        {status === "warning" ? "⚠ WARNING" : "✓ NORMAL"}
      </span>
    </div>
  );
}

function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f0f2f5",
      minHeight: "100vh", padding: "30px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ background: "#2c3e50", color: "white", padding: "20px 30px",
          borderRadius: "12px", marginBottom: "30px",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.8rem" }}>🌐 IoT Sensor Dashboard</h1>
            <p style={{ margin: "5px 0 0", opacity: 0.7 }}>
              KSIT — DevOps Workshop 2026
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "1.2rem" }}>🕐 {time}</p>
            <p style={{ margin: "5px 0 0", opacity: 0.7, fontSize: "0.85rem" }}>
              Live Updates Every 2s
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap",
          justifyContent: "center" }}>
          {sensors.map(s => <SensorCard key={s.id} sensor={s} />)}
        </div>
        <div style={{ marginTop: "30px", background: "white", padding: "20px",
          borderRadius: "12px", textAlign: "center", color: "#666" }}>
          <p style={{ margin: 0 }}>
            📦 Containerized with Docker &nbsp;|&nbsp;
            ⚙️ CI/CD via Jenkins &nbsp;|&nbsp;
            ☸️ Deployed on Kubernetes
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;