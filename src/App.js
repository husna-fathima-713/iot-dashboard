import React, { useState, useEffect } from "react";

// Configuration for Environmental Sensors
const SENSOR_CONFIG = [
  { id: "temp", name: "Temperature", unit: "°C", min: 18, max: 38, warn: 32, color: "#4299e1" },
  { id: "hum",  name: "Humidity",    unit: "%",  min: 30, max: 90, warn: 75, color: "#48bb78" },
  { id: "pres", name: "Pressure",    unit: "hPa",min: 980, max: 1050, warn: 1025, color: "#805ad5" },
  { id: "co2",  name: "CO2 Level",   unit: "ppm",min: 400, max: 1200, warn: 900, color: "#ecc94b" },
  { id: "aqi",  name: "Air Quality", unit: "AQI",min: 10, max: 200, warn: 100, color: "#f56565" },
];

const SensorCard = ({ config, value }) => {
  const isWarning = value >= config.warn;
  const getTheme = () => {
    if (isWarning) return { bg: "#fff5f5", border: "#feb2b2", text: "#c53030" };
    return { bg: "white", border: config.color, text: "#2d3748" };
  };
  const theme = getTheme();

  return (
    <div style={{
      background: theme.bg, borderBottom: `4px solid ${theme.border}`, borderRadius: "12px",
      padding: "24px 15px", textAlign: "center", flex: "1", minWidth: "160px",
      boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      transform: isWarning ? "scale(1.02)" : "scale(1)"
    }}>
      <p style={{ margin: "0 0 8px", fontSize: "0.75rem", fontWeight: "700", color: "#718096", textTransform: "uppercase" }}>{config.name}</p>
      <h2 style={{ margin: "0", fontSize: "2.2rem", fontWeight: "800", color: theme.text }}>{value}</h2>
      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", fontWeight: "600", color: "#a0aec0" }}>{config.unit}</p>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState({ temp: 22, hum: 45, pres: 1012, co2: 550, aqi: 42 });
  const [history, setHistory] = useState({ temp: [], aqi: [] });
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      const co2 = parseFloat((Math.random() * 600 + 400).toFixed(0));
      const temp = parseFloat((Math.random() * 10 + 20).toFixed(1));
      const aqi = Math.round((co2 / 1200) * 200 + (Math.random() * 10));

      setData({
        temp, hum: parseFloat((Math.random() * 30 + 40).toFixed(1)),
        pres: parseFloat((Math.random() * 40 + 980).toFixed(1)),
        co2, aqi
      });

      // Update history for the graph (keep last 20 points)
      setHistory(prev => ({
        temp: [...prev.temp, temp].slice(-20),
        aqi: [...prev.aqi, aqi].slice(-20)
      }));

      setTime(new Date().toLocaleTimeString());
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Helper to generate SVG Path for trends
  const getPath = (values, min, max) => {
    if (values.length < 2) return "";
    const width = 1000;
    const height = 150;
    return values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / (max - min)) * height;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div style={{ backgroundColor: "#f4f7fb", minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "800", color: "#1a202c" }}>IoT Sensor Dashboard</h1>
            <p style={{ margin: "4px 0 0", color: "#718096", fontSize: "0.95rem" }}>Real-Time Environmental Monitoring | KSIT_CSE-ICB</p>
          </div>
          <div style={{ textAlign: "right", color: "#4a5568", fontWeight: "600" }}>
            <span style={{ fontSize: "0.8rem", color: "#a0aec0", display: "block" }}>LIVE FEED</span>
            {time}
          </div>
        </header>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center", marginBottom: "30px" }}>
          {SENSOR_CONFIG.map(config => <SensorCard key={config.id} config={config} value={data[config.id]} />)}
        </div>

        {/* Informative Trend Graph */}
        <div style={{ background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#2d3748" }}>Telemetric Analysis</h3>
            <div style={{ display: "flex", gap: "15px", fontSize: "0.8rem", fontWeight: "bold" }}>
              <span style={{ color: "#4299e1" }}>● Temperature Analysis</span>
              <span style={{ color: "#f56565" }}>● AQI Index Analysis</span>
            </div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "8px", height: "150px", overflow: "hidden" }}>
            <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d={getPath(history.temp, 15, 40)} fill="none" stroke="#4299e1" strokeWidth="4" strokeLinecap="round" style={{ transition: "all 0.5s ease" }} />
              <path d={getPath(history.aqi, 0, 250)} fill="none" stroke="#f56565" strokeWidth="4" strokeLinecap="round" style={{ transition: "all 0.5s ease" }} />
            </svg>
          </div>
        </div>

        <footer style={{ marginTop: "60px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#a0aec0" }}>
          <div>STATUS: <span style={{ color: "#48bb78", fontWeight: "bold" }}>● CONNECTED</span></div>
          <div>PROTOCOL: MQTT over WebSockets</div>
          <div>BUILD: 2026.04.10_1KS23IC023</div>
        </footer>
      </div>
    </div>
  );
}