import React, { useState, useEffect } from "react";

const SENSOR_CONFIG = [
  { id: "temp", name: "Temperature", unit: "°C", min: 18, max: 38, warn: 32, color: "#4299e1" },
  { id: "hum",  name: "Humidity",    unit: "%",  min: 30, max: 90, warn: 75, color: "#48bb78" },
  { id: "pres", name: "Pressure",    unit: "hPa",min: 980, max: 1050, warn: 1025, color: "#805ad5" },
  { id: "co2",  name: "CO2 Level",   unit: "ppm",min: 400, max: 1200, warn: 900, color: "#ecc94b" },
  { id: "aqi",  name: "Air Quality", unit: "AQI",min: 10, max: 200, warn: 100, color: "#f56565" },
];

// REVISION: Added Build Metadata for Jenkins Verification
const DEPLOYMENT_INFO = {
  version: "v2.1.0-PROD",
  build_id: "BUILD_ID_2026.04.11_REACTIVE",
  author: "Husna Fathima | 1KS23IC023"
};

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
      transform: isWarning ? "scale(1.05)" : "scale(1)"
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
  const [logs, setLogs] = useState(["[SYS] Orchestrator Initialized...", "[K8S] Pod Connectivity Verified."]);
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

      setHistory(prev => ({
        temp: [...prev.temp, temp].slice(-25),
        aqi: [...prev.aqi, aqi].slice(-25)
      }));

      // ADDED: Security Logs for Visual Impact during Presentation
      if (Math.random() > 0.7) {
        const newLog = `[SEC] Inbound Packet: Payload_Size=${Math.floor(Math.random()*256)}kb | SRC_IP=192.168.1.${Math.floor(Math.random()*254)}`;
        setLogs(prev => [newLog, ...prev].slice(0, 5));
      }

      setTime(new Date().toLocaleTimeString());
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "white", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #1e293b", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "900", color: "#38bdf8" }}>IOT DASHBOARD</h1>
            <p style={{ margin: "4px 0 0", color: "#94a3b8" }}>{DEPLOYMENT_INFO.author} | <span style={{color: "#4ade80"}}>{DEPLOYMENT_INFO.version}</span></p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>TIME</span>
            <span style={{ fontFamily: "monospace", fontSize: "1.2rem" }}>{time}</span>
          </div>
        </header>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
          {SENSOR_CONFIG.map(config => <SensorCard key={config.id} config={config} value={data[config.id]} />)}
        </div>

        {/* Telemetry Analysis Section */}
        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#94a3b8" }}>LIVE TELEMETRY ANALYSIS</h3>
            <div style={{ display: "flex", gap: "15px", fontSize: "0.8rem" }}>
              <span style={{ color: "#4299e1" }}>TEMP ANALYSIS</span>
              <span style={{ color: "#f56565" }}>AQI ANALYSIS</span>
            </div>
          </div>
          <div style={{ background: "#0f172a", borderRadius: "8px", height: "150px" }}>
            <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d={getPath(history.temp, 15, 40)} fill="none" stroke="#4299e1" strokeWidth="4" />
              <path d={getPath(history.aqi, 0, 250)} fill="none" stroke="#f56565" strokeWidth="4" />
            </svg>
          </div>
        </div>

        {/* REVISION: Live Console Output for Cyber Security context */}
        <div style={{ background: "black", padding: "15px", borderRadius: "8px", fontFamily: "monospace", color: "#4ade80", fontSize: "0.85rem", border: "1px solid #334155" }}>
          <div style={{ color: "#64748b", marginBottom: "5px" }}>&gt; ACCESSING SYSTEM LOGS...</div>
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>

        <footer style={{ marginTop: "40px", borderTop: "1px solid #1e293b", paddingTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
          <div>NODE_STATUS: <span style={{ color: "#4ade80" }}>ONLINE</span></div>
          <div>DEPLOY_HASH: <span style={{ color: "#cbd5e1" }}>{DEPLOYMENT_INFO.build_id}</span></div>
          <div>KSIT CSE-ICB</div>
        </footer>
      </div>
    </div>
  );
}