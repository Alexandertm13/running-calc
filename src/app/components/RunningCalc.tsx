import { useState } from "react";

type Mode = "pace" | "time" | "circle";

interface Split {
  label: string;
  time: string;
  isFinal?: boolean;
}

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function formatPace(secsPerKm: number) {
  const m = Math.floor(secsPerKm / 60);
  const s = Math.floor(secsPerKm % 60);
  return `${pad(m)}:${pad(s)}`;
}

function buildSplits(distanceM: number, paceSecPerKm: number, step: number): Split[] {
  const splits: Split[] = [];
  
  if (step >= distanceM) {
    splits.push({
      label: `${distanceM} м`,
      time: formatTime((distanceM / 1000) * paceSecPerKm),
      isFinal: true,
    });
    return splits;
  }

  const totalSteps = Math.floor(distanceM / step);
  for (let i = 1; i <= totalSteps; i++) {
    const distAtSplit = i * step;
    const timeAtSplit = (distAtSplit / 1000) * paceSecPerKm;
    splits.push({ 
      label: `${distAtSplit} м`, 
      time: formatTime(timeAtSplit)
    });
  }
  
  const remainder = distanceM % step;
  if (remainder > 0) {
    splits.push({
      label: `${distanceM} м`,
      time: formatTime((distanceM / 1000) * paceSecPerKm),
      isFinal: true,
    });
  } else if (totalSteps > 0) {
    splits[splits.length - 1].isFinal = true;
  }
  return splits;
}

export function RunningCalc() {
  const [mode, setMode] = useState<Mode>("pace");
  
  // Общие поля
  const [distance, setDistance] = useState("");
  const [splitStep, setSplitStep] = useState<number>(200); 
  
  // Поля для режима "По времени"
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  
  // Поля для режима "По темпу"
  const [paceMin, setPaceMin] = useState("");
  const [paceSec, setPaceSec] = useState("");

  // Поля для режима "Круг"
  const [circleMin, setCircleMin] = useState("");
  const [circleSec, setCircleSec] = useState("");
  const [circleMs, setCircleMs] = useState("");
  const [circleDist, setCircleDist] = useState("400");

  const [result, setResult] = useState<{ label: string; value: string; pace?: string } | null>(null);
  const [splits, setSplits] = useState<Split[]>([]);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    setResult(null);
    setSplits([]);
    
    const dist = parseFloat(distance);
    if (!dist || dist <= 0) {
      setError("Введите дистанцию");
      return;
    }

    let calculatedPaceSecPerKm = 0;

    if (mode === "pace") {
      const totalSec =
        (parseInt(hours) || 0) * 3600 +
        (parseInt(minutes) || 0) * 60 +
        (parseInt(seconds) || 0);
        
      if (totalSec <= 0) {
        setError("Введите время");
        return;
      }
      
      calculatedPaceSecPerKm = (totalSec / dist) * 1000;
      setResult({ 
        label: "Ваш темп", 
        value: formatPace(calculatedPaceSecPerKm) + " /км" 
      });
      setSplits(buildSplits(dist, calculatedPaceSecPerKm, splitStep));
      
    } else if (mode === "time") {
      const ps = (parseInt(paceMin) || 0) * 60 + (parseInt(paceSec) || 0);
      if (ps <= 0) {
        setError("Введите темп");
        return;
      }
      calculatedPaceSecPerKm = ps;
      const totalSec = (dist / 1000) * ps;
      setResult({ 
        label: "Финишное время", 
        value: formatTime(totalSec) 
      });
      setSplits(buildSplits(dist, calculatedPaceSecPerKm, splitStep));
      
    } else if (mode === "circle") {
      const cDist = parseFloat(circleDist);
      const circleTotalSec = 
        (parseInt(circleMin) || 0) * 60 + 
        (parseInt(circleSec) || 0) + 
        (parseInt(circleMs) || 0) / 1000;
        
      if (circleTotalSec <= 0) {
        setError("Введите время круга");
        return;
      }

      calculatedPaceSecPerKm = (circleTotalSec / (cDist / 1000));
      const finishTimeSec = (dist / 1000) * calculatedPaceSecPerKm;
      
      setResult({ 
        label: "Финиш", 
        value: formatTime(finishTimeSec),
        pace: formatPace(calculatedPaceSecPerKm) + " /км"
      });
      setSplits(buildSplits(dist, calculatedPaceSecPerKm, splitStep));
    }
  }

  const gold = "#C9A84C";
  const goldDim = "rgba(201,168,76,0.15)";
  const goldBorder = "rgba(201,168,76,0.3)";
  
  const inputStyle = {
    backgroundColor: "#222222",
    border: `1px solid ${goldBorder}`,
    borderRadius: "8px",
    color: "#F0D080",
    padding: "10px 12px",
    width: "100%",
    outline: "none",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "16px",
    fontVariantNumeric: "tabular-nums",
    transition: "border-color 0.2s",
  } as const;

  const stepOptions = [100, 200, 400, 1000];

  return (
    <div
      className="min-h-screen flex items-start justify-center p-3 relative overflow-y-auto"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 600"
        style={{ opacity: 0.15 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const r = 60 + i * 52;
          return <ellipse key={`tl-${i}`} cx="160" cy="120" rx={r} ry={r * 0.55} fill="none" stroke="#C9A84C" strokeWidth={i % 3 === 0 ? "1.4" : "0.7"} />;
        })}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const r = 50 + i * 55;
          return <ellipse key={`br-${i}`} cx="640" cy="480" rx={r} ry={r * 0.6} fill="none" stroke="#C9A84C" strokeWidth={i % 3 === 0 ? "1.4" : "0.7"} />;
        })}
      </svg>

        <div className="w-full relative z-10" style={{ maxWidth: "400px" }}>
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-1">
            {/* Овальный трек — иконка стадиона */}
            <svg width="40" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Поле */}
              <rect x="2" y="2" width="36" height="48" rx="16" fill="#ffffff" />
              {/* Внешняя дорожка */}
              <rect x="2" y="2" width="36" height="48" rx="16" fill="none" stroke="#111111" strokeWidth="2.5" />
              {/* Дорожка 2 */}
              <rect x="6" y="6" width="28" height="40" rx="12" fill="none" stroke="#111111" strokeWidth="1.2" />
              {/* Дорожка 3 */}
              <rect x="10" y="10" width="20" height="32" rx="9" fill="none" stroke="#111111" strokeWidth="1" />
              {/* Центральный газон */}
              <rect x="13" y="14" width="14" height="24" rx="6" fill="#1A1A1A" />
              {/* Финишная черта */}
              <line x1="2" y1="26" x2="38" y2="26" stroke="#111111" strokeWidth="1" strokeDasharray="3 3" />
            </svg>

            <div
              style={{
                fontSize: "38px",
                fontWeight: 800,
                color: gold,
                letterSpacing: "-1px",
                lineHeight: 1,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              LOOP
            </div>
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#A0A0A0",
              letterSpacing: "4px",
              marginTop: "6px",
              textTransform: "uppercase",
            }}
          >
            Pace Calculator
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#1A1A1A",
            border: `1px solid ${goldBorder}`,
            borderRadius: "16px",
            padding: "20px",
            boxShadow: `0 8px 30px rgba(0,0,0,0.5)`,
          }}
        >
          <div className="flex mb-4" style={{ backgroundColor: "#111111", borderRadius: "10px", padding: "3px", border: `1px solid ${goldBorder}` }}>
            {(["pace", "time", "circle"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setResult(null); setSplits([]); setError(""); }}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 700, transition: "all 0.2s",
                  backgroundColor: mode === m ? gold : "transparent",
                  color: mode === m ? "#111111" : "#A0A0A0",
                }}
              >
                {m === "pace" ? "По темпу" : m === "time" ? "По времени" : "Круг"}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label style={{ display: "block", color: "#A0A0A0", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>
              Дистанция (метры)
            </label>
            <input type="number" inputMode="numeric" placeholder="10000" value={distance} onChange={(e) => setDistance(e.target.value)} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = gold)} onBlur={(e) => (e.target.style.borderColor = goldBorder)} />
          </div>

          {mode === "pace" && (
            <div className="mb-4">
              <label style={{ display: "block", color: "#A0A0A0", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>Время финиша</label>
              <div className="flex gap-2">
                {[{ val: hours, set: setHours, ph: "чч" }, { val: minutes, set: setMinutes, ph: "мм" }, { val: seconds, set: setSeconds, ph: "сс" }].map(({ val, set, ph }) => (
                  <input key={ph} type="number" inputMode="numeric" placeholder={ph} min={0} value={val} onChange={(e) => set(e.target.value)} style={{ ...inputStyle, textAlign: "center" }} onFocus={(e) => (e.target.style.borderColor = gold)} onBlur={(e) => (e.target.style.borderColor = goldBorder)} />
                ))}
              </div>
            </div>
          )}

          {mode === "time" && (
            <div className="mb-4">
              <label style={{ display: "block", color: "#A0A0A0", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>Темп (мин/км)</label>
              <div className="flex gap-2">
                {[{ val: paceMin, set: setPaceMin, ph: "мин" }, { val: paceSec, set: setPaceSec, ph: "сек" }].map(({ val, set, ph }) => (
                  <input key={ph} type="number" inputMode="numeric" placeholder={ph} min={0} value={val} onChange={(e) => set(e.target.value)} style={{ ...inputStyle, textAlign: "center" }} onFocus={(e) => (e.target.style.borderColor = gold)} onBlur={(e) => (e.target.style.borderColor = goldBorder)} />
                ))}
              </div>
            </div>
          )}

          {mode === "circle" && (
            <>
              <div className="mb-4">
                <label style={{ display: "block", color: "#A0A0A0", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>
                  Длина круга (м)
                </label>
                <div className="flex gap-2">
                  {["200", "400"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCircleDist(opt)}
                      style={{
                        flex: 1, padding: "9px 0", borderRadius: "8px", border: "none", cursor: "pointer",
                        fontSize: "14px", fontWeight: 700, transition: "all 0.2s",
                        backgroundColor: circleDist === opt ? gold : "#222222",
                        color: circleDist === opt ? "#111111" : "#A0A0A0",
                        border: circleDist === opt ? "none" : `1px solid ${goldBorder}`,
                      }}
                    >
                      {opt} м
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label style={{ display: "block", color: "#A0A0A0", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>Время на круг</label>
                <div className="flex gap-2">
                  <input type="number" inputMode="numeric" placeholder="мин" min={0} value={circleMin} onChange={(e) => setCircleMin(e.target.value)} style={{ ...inputStyle, textAlign: "center" }} onFocus={(e) => (e.target.style.borderColor = gold)} onBlur={(e) => (e.target.style.borderColor = goldBorder)} />
                  <input type="number" inputMode="numeric" placeholder="сек" min={0} max={59} value={circleSec} onChange={(e) => setCircleSec(e.target.value)} style={{ ...inputStyle, textAlign: "center" }} onFocus={(e) => (e.target.style.borderColor = gold)} onBlur={(e) => (e.target.style.borderColor = goldBorder)} />
                  <input type="number" inputMode="numeric" placeholder="мс" min={0} max={999} value={circleMs} onChange={(e) => setCircleMs(e.target.value)} style={{ ...inputStyle, textAlign: "center" }} onFocus={(e) => (e.target.style.borderColor = gold)} onBlur={(e) => (e.target.style.borderColor = goldBorder)} />
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <label style={{ display: "block", color: "#A0A0A0", fontSize: "11px", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" }}>
              Круг отсечки (м)
            </label>
            <div className="flex gap-2">
              {stepOptions.map((step) => (
                <button
                  key={step}
                  onClick={() => setSplitStep(step)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 700,
                    transition: "all 0.2s",
                    backgroundColor: splitStep === step ? gold : "#222222",
                    color: splitStep === step ? "#111111" : "#A0A0A0",
                    border: splitStep === step ? "none" : `1px solid ${goldBorder}`,
                  }}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          <button onClick={calculate} className="w-full active:scale-[0.98] transition-transform" style={{ height: "48px", backgroundColor: gold, color: "#111111", borderRadius: "10px", border: "none", fontSize: "15px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 15px rgba(201,168,76,0.3)` }}>
            Рассчитать
          </button>

          {error && (
            <div className="mt-3 text-center" style={{ color: "#ff6b6b", fontSize: "13px" }}>
              {error}
            </div>
          )}
        </div>

        {splits.length > 0 && (
          <div className="mt-4" style={{ backgroundColor: "#1A1A1A", border: `1px solid ${goldBorder}`, borderRadius: "16px", overflow: "hidden" }}>
            <div className="flex justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${goldBorder}` }}>
              <span style={{ fontSize: "11px", color: "#A0A0A0", letterSpacing: "1.5px", textTransform: "uppercase" }}>Отсечка</span>
              <span style={{ fontSize: "11px", color: "#A0A0A0", letterSpacing: "1.5px", textTransform: "uppercase" }}>Время</span>
            </div>
            <div>
              {splits.map((s, i) => (
                <div key={i} className="flex justify-between px-4 py-2.5" style={{ borderBottom: i < splits.length - 1 ? `1px solid ${goldBorder}` : "none", backgroundColor: s.isFinal ? goldDim : "transparent" }}>
                  <span style={{ fontSize: "14px", color: s.isFinal ? gold : "#D0D0D0", fontWeight: s.isFinal ? 700 : 400 }}>{s.label}</span>
                  <span style={{ fontSize: "14px", color: s.isFinal ? gold : "#D0D0D0", fontWeight: s.isFinal ? 700 : 400, fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: "tabular-nums" }}>{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4" style={{ backgroundColor: "#1A1A1A", border: `1.5px solid ${gold}`, borderRadius: "16px", padding: "16px 20px", boxShadow: `0 4px 20px rgba(201,168,76,0.15)` }}>
            <div style={{ fontSize: "12px", color: "#A0A0A0", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>{result.label}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: "28px", fontWeight: 800, color: gold, fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: "tabular-nums" }}>{result.value}</div>
              {result.pace && (
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#F0D080", fontFamily: "'JetBrains Mono', monospace" }}>{result.pace}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
