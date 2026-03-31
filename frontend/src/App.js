import React, { useState, useRef, useEffect } from "react";

const API_URL = "https://backendai-6nxd.onrender.com";

// ══════════════════════════════════════════════════════════════════════════════
//  AUTH HELPERS
// ══════════════════════════════════════════════════════════════════════════════
const getToken  = ()        => localStorage.getItem("ats_token");
const setToken  = (t)       => localStorage.setItem("ats_token", t);
const clearToken = ()       => localStorage.removeItem("ats_token");
const getUser   = ()        => { try { return JSON.parse(localStorage.getItem("ats_user")); } catch { return null; } };
const setUser   = (u)       => localStorage.setItem("ats_user", JSON.stringify(u));
const clearUser = ()        => localStorage.removeItem("ats_user");

const authFetch = (url, options = {}) => {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// ══════════════════════════════════════════════════════════════════════════════
//  LOGIN / REGISTER PAGE
// ══════════════════════════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [mode, setMode]         = useState("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPw, setShowPw]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login"
        ? { email, password }
        : { email, password, name };

      const res  = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Authentication failed.");

      setToken(data.token);
      setUser(data.user);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          background: #05060f;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        @keyframes floatUp {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.04; }
          50% { opacity: 0.08; }
          100% { transform: translateY(-120vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .auth-card { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .auth-input::placeholder { color: #475569; }
        .auth-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
          position: relative;
          overflow: hidden;
        }
        .auth-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
          background-size: 200% auto;
          animation: shimmer 2.4s linear infinite;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.5); }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .mode-toggle {
          background: none;
          border: none;
          color: #818cf8;
          cursor: pointer;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
          padding: 0;
        }
        .mode-toggle:hover { color: #a5b4fc; }
        .particle {
          position: fixed;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6366f1;
          animation: floatUp linear infinite;
          pointer-events: none;
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #05060f; }
        ::-webkit-scrollbar-thumb { background: #1e2748; border-radius: 3px; }
      `}</style>

      {[...Array(10)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${5 + i * 9.5}%`,
          bottom: `-10px`,
          animationDuration: `${8 + (i * 1.3)}s`,
          animationDelay: `${i * 0.9}s`,
          opacity: 0.06,
          width: `${4 + (i % 3) * 3}px`,
          height: `${4 + (i % 3) * 3}px`,
          background: i % 2 === 0 ? "#6366f1" : "#34d399",
        }} />
      ))}

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 55% at 30% 20%, rgba(99,102,241,0.09) 0%, transparent 65%),
          radial-gradient(ellipse 40% 40% at 75% 80%, rgba(52,211,153,0.06) 0%, transparent 60%)
        `,
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
      }}>
        <div className="auth-card" style={{
          width: "min(460px, 100%)",
          background: "rgba(13,15,26,0.92)",
          border: "1px solid rgba(99,102,241,0.18)",
          borderRadius: "24px",
          padding: "44px 40px 38px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "56px", height: "56px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
              fontSize: "26px",
              position: "relative",
            }}>
              🎯
              <div style={{
                position: "absolute", inset: "-4px",
                border: "2px solid rgba(99,102,241,0.25)",
                borderRadius: "20px",
                animation: "pulse-ring 2s ease-out infinite",
              }} />
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "26px", fontWeight: "800",
              background: "linear-gradient(120deg, #e2e8f0 0%, #818cf8 60%, #34d399 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em", marginBottom: "6px",
            }}>
              ATS Resume Pro
            </h1>
            <p style={{ color: "#475569", fontSize: "13px", fontFamily: "'DM Mono',monospace" }}>
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#64748b",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "'DM Mono',monospace", marginBottom: "7px" }}>
                  Full Name
                </label>
                <input
                  className="auth-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#64748b",
                letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: "'DM Mono',monospace", marginBottom: "7px" }}>
                Email Address
              </label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#64748b",
                letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: "'DM Mono',monospace", marginBottom: "7px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="auth-input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  style={{ paddingRight: "50px" }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#475569", fontSize: "16px", padding: "4px",
                  transition: "color 0.15s",
                }} onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                   onMouseLeave={e => e.currentTarget.style.color = "#475569"}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
              {mode === "register" && (
                <div style={{ marginTop: "6px", display: "flex", gap: "4px" }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: "3px", borderRadius: "2px",
                      background: password.length >= i * 3
                        ? password.length >= 10 ? "#34d399" : password.length >= 6 ? "#fbbf24" : "#f87171"
                        : "rgba(255,255,255,0.08)",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.22)",
                borderRadius: "10px", padding: "11px 14px",
                color: "#f87171", fontSize: "13px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                ⚠️ {error}
              </div>
            )}

            <button className="auth-btn" type="submit" disabled={loading} style={{ marginTop: "4px" }}>
              {loading
                ? <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      display: "inline-block", width: "14px", height: "14px",
                      border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                      borderRadius: "50%", animation: "spin 0.7s linear infinite",
                    }} />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                : mode === "login" ? "Sign In →" : "Create Account →"
              }
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "22px" }}>
            <span style={{ color: "#475569", fontSize: "13.5px" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              className="mode-toggle"
              onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); }}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  Circular Score Ring
// ══════════════════════════════════════════════════════════════════════════════
function ScoreRing({ value, label, color }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const grade = value >= 85 ? "A+" : value >= 75 ? "A" : value >= 65 ? "B+" : value >= 55 ? "B" : value >= 40 ? "C" : "D";
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.34,1.56,.64,1)" }} />
        <text x="55" y="50" textAnchor="middle" fill="white" fontSize="17" fontWeight="700" fontFamily="'DM Mono',monospace">{value}%</text>
        <text x="55" y="68" textAnchor="middle" fill={color} fontSize="13" fontWeight="700" fontFamily="'DM Mono',monospace">{grade}</text>
      </svg>
      <p style={{ margin: "6px 0 0", fontSize: "10px", color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace" }}>{label}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  Keyword Chip
// ══════════════════════════════════════════════════════════════════════════════
function Chip({ children, type = "neutral" }) {
  const colors = {
    match:   { bg: "rgba(52,211,153,.1)",  color: "#34d399", border: "rgba(52,211,153,.2)" },
    miss:    { bg: "rgba(248,113,113,.1)", color: "#f87171", border: "rgba(248,113,113,.2)" },
    neutral: { bg: "rgba(99,102,241,.1)",  color: "#818cf8", border: "rgba(99,102,241,.2)" },
    added:   { bg: "rgba(251,191,36,.1)",  color: "#fbbf24", border: "rgba(251,191,36,.25)" },
  };
  const c = colors[type] || colors.neutral;
  return (
    <span style={{
      display: "inline-block", padding: "3px 11px", borderRadius: "20px",
      fontSize: "11px", fontFamily: "'DM Mono',monospace", fontWeight: "500",
      margin: "3px", background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{children}</span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  PROFESSIONAL ATS RESUME PREVIEW
// ══════════════════════════════════════════════════════════════════════════════
function ResumePreview({ r }) {
  if (!r) return null;
  const sk = r.skills || {};

  const base = { fontFamily: "'Calibri', 'Cambria', Georgia, serif", fontSize: "10.5pt", color: "#1a1a1a", lineHeight: "1.5" };
  const sectionTitle = {
    fontFamily: "'Calibri', Georgia, serif", fontSize: "11pt", fontWeight: "700", color: "#1a1a2e",
    textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #1a1a2e",
    paddingBottom: "3px", marginBottom: "7px", marginTop: "14px",
  };
  const bulletRow = { display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "3px", ...base };

  const SkillLine = ({ label, arr }) => {
    if (!arr?.length) return null;
    return (
      <div style={{ ...base, marginBottom: "3px", lineHeight: "1.6" }}>
        <span style={{ fontWeight: "700" }}>{label}: </span>
        {arr.map((s, i) => {
          const name  = typeof s === "object" ? s.name : s;
          const added = typeof s === "object" ? s.added : false;
          return (
            <span key={i}>
              {i > 0 && <span style={{ color: "#555" }}> • </span>}
              {added
                ? <span style={{ color: "#1a4fa0", fontStyle: "italic" }} title="Added to match JD">{name}*</span>
                : <span>{name}</span>}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      background: "#ffffff", padding: "32px 36px", maxHeight: "780px",
      overflowY: "auto", fontFamily: "'Calibri', Georgia, serif",
      boxShadow: "0 4px 32px rgba(0,0,0,0.18)", borderRadius: "6px", color: "#1a1a1a",
    }}>
      <div style={{ textAlign: "center", marginBottom: "12px", paddingBottom: "12px", borderBottom: "2.5px solid #1a1a2e" }}>
        <div style={{ fontFamily: "'Calibri', Georgia, serif", fontSize: "22pt", fontWeight: "700", color: "#1a1a2e", letterSpacing: "0.03em", lineHeight: "1.2" }}>
          {r.name || "Your Name"}
        </div>
        <div style={{ marginTop: "6px", fontSize: "9.5pt", color: "#444", fontFamily: "'Calibri', Georgia, serif", lineHeight: "1.8", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}>
          {r.phone    && <span>📞 {r.phone}</span>}
          {r.email    && <span>✉ {r.email}</span>}
          {r.linkedin && <span>🔗 {r.linkedin}</span>}
          {r.github   && <span>💻 {r.github}</span>}
          {r.location && <span>📍 {r.location}</span>}
        </div>
      </div>

      {r.objective && (
        <>
          <div style={sectionTitle}>Professional Summary</div>
          <p style={{ ...base, marginBottom: "4px", textAlign: "justify" }}>{r.objective}</p>
        </>
      )}

      {r.education?.filter(e => e.institution).length > 0 && (
        <>
          <div style={sectionTitle}>Education</div>
          {r.education.filter(e => e.institution).map((e, i) => (
            <div key={i} style={{ marginBottom: "9px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "4px" }}>
                <div>
                  <span style={{ ...base, fontWeight: "700", fontSize: "10.5pt" }}>{e.degree}</span>
                  {e.institution && <span style={{ ...base, color: "#333" }}> — {e.institution}</span>}
                  {e.location    && <span style={{ ...base, color: "#666", fontSize: "9.5pt" }}> | {e.location}</span>}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {e.score && <div style={{ ...base, fontWeight: "700", color: "#1a1a2e", fontSize: "9.5pt" }}>{e.score}</div>}
                  {e.year  && <div style={{ ...base, color: "#555", fontSize: "9.5pt" }}>{e.year}</div>}
                </div>
              </div>
              {e.relevant_courses?.length > 0 && (
                <div style={{ ...base, fontSize: "9.5pt", color: "#555", marginTop: "2px" }}>
                  <span style={{ fontWeight: "600" }}>Relevant Courses: </span>{e.relevant_courses.join(" • ")}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {(sk.languages?.length || sk.frameworks?.length || sk.databases?.length || sk.tools?.length || sk.cloud?.length || sk.concepts?.length || sk.other?.length) ? (
        <>
          <div style={sectionTitle}>Technical Skills</div>
          <div style={{ marginBottom: "4px" }}>
            <SkillLine label="Languages"              arr={sk.languages} />
            <SkillLine label="Frameworks & Libraries" arr={sk.frameworks} />
            <SkillLine label="Databases"              arr={sk.databases} />
            <SkillLine label="Tools & Platforms"      arr={sk.tools} />
            <SkillLine label="Cloud"                  arr={sk.cloud} />
            <SkillLine label="Concepts"               arr={sk.concepts} />
            <SkillLine label="Other"                  arr={sk.other} />
          </div>
          <div style={{ fontSize: "8.5pt", color: "#777", fontStyle: "italic", marginTop: "3px" }}>
            * Skills added to align with job requirements
          </div>
        </>
      ) : null}

      {r.experience?.length > 0 && (
        <>
          <div style={sectionTitle}>Professional Experience</div>
          {r.experience.map((ex, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                  <span style={{ ...base, fontWeight: "700", fontSize: "10.5pt" }}>{ex.title}</span>
                  {ex.type     && <span style={{ ...base, color: "#555", fontSize: "9pt" }}> ({ex.type})</span>}
                  {ex.company  && <span style={{ ...base, color: "#333" }}> — {ex.company}</span>}
                  {ex.location && <span style={{ ...base, color: "#666", fontSize: "9.5pt" }}> | {ex.location}</span>}
                </div>
                {ex.duration && <div style={{ ...base, fontWeight: "600", color: "#1a1a2e", fontSize: "9.5pt", flexShrink: 0 }}>{ex.duration}</div>}
              </div>
              {(ex.points || []).map((pt, j) => (
                <div key={j} style={bulletRow}>
                  <span style={{ color: "#1a1a2e", fontWeight: "700", flexShrink: 0, marginTop: "1px", fontSize: "10pt" }}>•</span>
                  <span style={{ ...base, color: "#222", textAlign: "justify" }}>{pt}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {r.projects?.length > 0 && (
        <>
          <div style={sectionTitle}>Projects</div>
          {r.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "4px" }}>
                <div>
                  <span style={{ ...base, fontWeight: "700", fontSize: "10.5pt" }}>{p.title}</span>
                  {p.tech && <span style={{ ...base, color: "#555", fontSize: "9pt" }}> | {p.tech}</span>}
                </div>
                <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                  {p.github && <span style={{ ...base, color: "#1a4fa0", fontSize: "9pt" }}>{p.github}</span>}
                  {p.live   && <span style={{ ...base, color: "#1a4fa0", fontSize: "9pt" }}>{p.live}</span>}
                </div>
              </div>
              {(p.points || []).map((pt, j) => (
                <div key={j} style={bulletRow}>
                  <span style={{ color: "#1a1a2e", fontWeight: "700", flexShrink: 0, marginTop: "1px", fontSize: "10pt" }}>•</span>
                  <span style={{ ...base, color: "#222", textAlign: "justify" }}>{pt}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {r.achievements?.length > 0 && (
        <>
          <div style={sectionTitle}>Achievements & Awards</div>
          {r.achievements.map((a, i) => (
            <div key={i} style={bulletRow}>
              <span style={{ color: "#1a1a2e", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>•</span>
              <span style={{ ...base, color: "#222" }}>{a}</span>
            </div>
          ))}
        </>
      )}

      {r.certifications?.length > 0 && (
        <>
          <div style={sectionTitle}>Certifications</div>
          {r.certifications.map((c, i) => (
            <div key={i} style={bulletRow}>
              <span style={{ color: "#1a1a2e", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>•</span>
              <span style={{ ...base, color: "#222" }}>{c}</span>
            </div>
          ))}
        </>
      )}

      {r.activities?.length > 0 && (
        <>
          <div style={sectionTitle}>Extracurricular Activities</div>
          {r.activities.map((a, i) => (
            <div key={i} style={bulletRow}>
              <span style={{ color: "#1a1a2e", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>•</span>
              <span style={{ ...base, color: "#222" }}>{a}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  PRINT / DOWNLOAD FUNCTION
// ══════════════════════════════════════════════════════════════════════════════
function printResume(r) {
  if (!r) return;
  const sk = r.skills || {};

  const skillLine = (label, arr) => {
    if (!arr?.length) return "";
    const items = arr.map(s => {
      const name  = typeof s === "object" ? s.name : s;
      const added = typeof s === "object" ? s.added : false;
      return added ? `<em style="color:#1a4fa0">${name}*</em>` : name;
    }).join(" &bull; ");
    return `<p style="margin:2px 0;font-size:10pt"><strong>${label}:</strong> ${items}</p>`;
  };

  const sec = (title, html) =>
    html?.trim() ? `<div class="sec"><div class="st">${title}</div>${html}</div>` : "";

  const bullet = (text) =>
    `<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:3px">
      <span style="font-weight:700;flex-shrink:0;margin-top:1px">•</span><span>${text}</span>
    </div>`;

  const eduHtml = (r.education || []).filter(e => e.institution).map(e => `
    <div style="margin-bottom:9px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap">
        <div><strong>${e.degree || ""}</strong>${e.institution ? ` — ${e.institution}` : ""}
          ${e.location ? `<span style="color:#666;font-size:9.5pt"> | ${e.location}</span>` : ""}</div>
        <div style="text-align:right;flex-shrink:0">
          ${e.score ? `<div style="font-weight:700;color:#1a1a2e;font-size:9.5pt">${e.score}</div>` : ""}
          ${e.year  ? `<div style="color:#555;font-size:9.5pt">${e.year}</div>` : ""}
        </div>
      </div>
      ${e.relevant_courses?.length ? `<div style="font-size:9.5pt;color:#555;margin-top:2px"><strong>Relevant Courses:</strong> ${e.relevant_courses.join(" • ")}</div>` : ""}
    </div>`).join("");

  const expHtml = (r.experience || []).map(ex => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap">
        <div><strong>${ex.title || ""}${ex.type ? ` (${ex.type})` : ""}</strong>${ex.company ? ` — ${ex.company}` : ""}
          ${ex.location ? `<span style="color:#666;font-size:9.5pt"> | ${ex.location}</span>` : ""}</div>
        ${ex.duration ? `<div style="font-weight:600;color:#1a1a2e;font-size:9.5pt;flex-shrink:0">${ex.duration}</div>` : ""}
      </div>
      ${(ex.points || []).map(pt => bullet(pt)).join("")}
    </div>`).join("");

  const projHtml = (r.projects || []).map(p => `
    <div style="margin-bottom:11px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px">
        <div><strong>${p.title || ""}</strong>${p.tech ? ` <span style="color:#555;font-size:9pt">| ${p.tech}</span>` : ""}</div>
        <div>${[p.github, p.live].filter(Boolean).map(u => `<span style="color:#1a4fa0;font-size:9pt">${u}</span>`).join("  ")}</div>
      </div>
      ${(p.points || []).map(pt => bullet(pt)).join("")}
    </div>`).join("");

  const skillsHtml = [
    skillLine("Languages", sk.languages),
    skillLine("Frameworks & Libraries", sk.frameworks),
    skillLine("Databases", sk.databases),
    skillLine("Tools & Platforms", sk.tools),
    skillLine("Cloud", sk.cloud),
    skillLine("Concepts", sk.concepts),
    skillLine("Other", sk.other),
  ].filter(Boolean).join("") +
    `<p style="font-size:8.5pt;color:#777;font-style:italic;margin-top:3px">* Skills added to align with job requirements</p>`;

  const contactParts = [
    r.phone    && `📞 ${r.phone}`,
    r.email    && `✉ ${r.email}`,
    r.linkedin && `🔗 ${r.linkedin}`,
    r.github   && `💻 ${r.github}`,
    r.location && `📍 ${r.location}`,
  ].filter(Boolean);

  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html><html><head>
  <meta charset="UTF-8"><title>${r.name || "Resume"}</title>
  <style>
    @page { margin: 13mm 14mm; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Calibri','Cambria',Georgia,serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.5; }
    .header { text-align: center; border-bottom: 2.5px solid #1a1a2e; padding-bottom: 10px; margin-bottom: 4px; }
    h1 { font-size: 22pt; font-weight: 700; color: #1a1a2e; letter-spacing: 0.03em; line-height: 1.2; }
    .contact { font-size: 9.5pt; color: #444; margin-top: 5px; display: flex; flex-wrap: wrap; justify-content: center; gap: 0 14px; line-height: 1.8; }
    .sec { margin-bottom: 6px; }
    .st { font-size: 11pt; font-weight: 700; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #1a1a2e; padding-bottom: 2px; margin-bottom: 7px; margin-top: 13px; }
    p { margin: 0 0 2px; }
  </style></head><body>
  <div class="header">
    <h1>${r.name || ""}</h1>
    <div class="contact">${contactParts.map(p => `<span>${p}</span>`).join("")}</div>
  </div>
  ${sec("Professional Summary", r.objective ? `<p style="text-align:justify">${r.objective}</p>` : "")}
  ${sec("Education", eduHtml)}
  ${sec("Technical Skills", skillsHtml)}
  ${sec("Professional Experience", expHtml)}
  ${sec("Projects", projHtml)}
  ${sec("Achievements & Awards", (r.achievements || []).map(bullet).join(""))}
  ${sec("Certifications", (r.certifications || []).map(bullet).join(""))}
  ${sec("Extracurricular Activities", (r.activities || []).map(bullet).join(""))}
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

// ══════════════════════════════════════════════════════════════════════════════
//  HISTORY PANEL
// ══════════════════════════════════════════════════════════════════════════════
function HistoryPanel({ onLoad, onClose }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`${API_URL}/history`)
      .then(r => r.json())
      .then(d => { if (d.success) setItems(d.analyses); })
      .finally(() => setLoading(false));
  }, []);

  const deleteItem = async (id, e) => {
    e.stopPropagation();
    await authFetch(`${API_URL}/history/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(6px)",
    }} onClick={onClose}>
      <div style={{
        background: "#0d0f1a", border: "1px solid #1e2748", borderRadius: "18px",
        padding: "28px 28px 20px", width: "min(560px, 94vw)", maxHeight: "80vh",
        display: "flex", flexDirection: "column", gap: "14px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ color: "#e2e8f0", fontSize: "18px", fontWeight: "700", fontFamily: "'Syne',sans-serif" }}>Analysis History</h2>
            <p style={{ color: "#64748b", fontSize: "12px", marginTop: "3px" }}>Click any entry to reload results</p>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid #1e2748", borderRadius: "8px",
            color: "#94a3b8", width: "34px", height: "34px", cursor: "pointer", fontSize: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading && <div style={{ textAlign: "center", color: "#64748b", padding: "32px", fontFamily: "'DM Mono',monospace" }}>Loading...</div>}
          {!loading && items.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: "32px", fontFamily: "'DM Mono',monospace" }}>No history yet. Analyze a resume first!</div>}
          {items.map(item => (
            <div key={item._id} onClick={() => onLoad(item._id)}
              style={{ padding: "14px 16px", borderRadius: "10px", cursor: "pointer", border: "1px solid #1e2748", marginBottom: "8px", background: "rgba(255,255,255,0.02)", transition: "background 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.07)"; e.currentTarget.style.borderColor = "#3d4a7a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "#1e2748"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "600", fontFamily: "'Syne',sans-serif", marginBottom: "4px" }}>{item.filename}</div>
                  <div style={{ color: "#64748b", fontSize: "11px", fontFamily: "'DM Mono',monospace" }}>
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "'DM Mono',monospace" }}>
                    ATS <span style={{ color: "#818cf8", fontWeight: "700" }}>{item.ats_score}%</span>
                    {" "}· Match <span style={{ color: "#34d399", fontWeight: "700" }}>{item.job_match_score}%</span>
                  </div>
                  <button onClick={e => deleteItem(item._id, e)} style={{
                    background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: "6px", color: "#f87171", cursor: "pointer",
                    width: "28px", height: "28px", fontSize: "13px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN APP (Protected — requires login)
// ══════════════════════════════════════════════════════════════════════════════
function MainApp({ user, onLogout }) {
  const [file, setFile]               = useState(null);
  const [fileURL, setFileURL]         = useState("");
  const [jd, setJd]                   = useState("");
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [dragOver, setDragOver]       = useState(false);
  const [copied, setCopied]           = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const fileRef    = useRef();
  const resultsRef = useRef();

  const handleFile = (f) => {
    if (!f || f.type !== "application/pdf") { setError("Only PDF files are supported."); return; }
    setFile(f); setFileURL(URL.createObjectURL(f)); setError("");
  };

  const handleAnalyze = async () => {
    if (!file)      { setError("Please upload your resume PDF."); return; }
    if (!jd.trim()) { setError("Please paste a job description."); return; }
    setLoading(true); setError(""); setResult(null);

    const fd = new FormData();
    fd.append("resume", file);
    fd.append("jd", jd);

    try {
      const res  = await authFetch(`${API_URL}/analyze`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Analysis failed.");
      setResult(data.result);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = async (id) => {
    setShowHistory(false);
    try {
      const res  = await authFetch(`${API_URL}/history/${id}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch {}
  };

  const handleCopy = () => {
    const el = document.getElementById("resumePreviewText");
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });
  };

  const S = {
    page:     { maxWidth: "1100px", margin: "0 auto", padding: "48px 20px 100px" },
    card:     { background: "#0d0f1a", border: "1px solid #1e2748", borderRadius: "16px" },
    label:    { fontSize: "10px", color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace", marginBottom: "10px" },
    textarea: { width: "100%", background: "transparent", border: "none", outline: "none", color: "#cbd5e1", fontSize: "13px", lineHeight: "1.7", resize: "none", fontFamily: "'DM Sans',sans-serif", minHeight: "160px" },
    btnMain:  { width: "100%", padding: "17px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.04em", fontFamily: "'Syne',sans-serif", boxShadow: "0 4px 24px rgba(99,102,241,0.35)", transition: "opacity 0.2s, transform 0.15s" },
    btnSm:    (bg) => ({ padding: "7px 14px", borderRadius: "8px", border: "none", background: bg, color: "white", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Mono',monospace", letterSpacing: ".04em", transition: "opacity 0.15s" }),
    secBar:   { display: "block", width: "3px", height: "16px", background: "linear-gradient(180deg, #6366f1, #34d399)", borderRadius: "2px" },
    secLbl:   { margin: 0, fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#64748b", fontFamily: "'DM Mono',monospace" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #060810; color: #cbd5e1; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
        body::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 70% 50% at 15% -5%, rgba(99,102,241,.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 85% 90%, rgba(52,211,153,.05) 0%, transparent 60%);
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060810; }
        ::-webkit-scrollbar-thumb { background: #1e2748; border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .analyze-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .analyze-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {showHistory && <HistoryPanel onLoad={loadFromHistory} onClose={() => setShowHistory(false)} />}

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={S.page}>

          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <div style={{ marginBottom: "40px" }}>

            {/* Row 1: User info + Sign out (right-aligned) */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.04)", border: "1px solid #1e2748",
                borderRadius: "10px", padding: "7px 14px",
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: "700", color: "white",
                  fontFamily: "'Syne',sans-serif", flexShrink: 0,
                }}>
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </div>
                <div style={{ textAlign: "left" }}>
                  {user.name && (
                    <div style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: "600", fontFamily: "'Syne',sans-serif", lineHeight: 1.2, whiteSpace: "nowrap" }}>
                      {user.name}
                    </div>
                  )}
                  <div style={{ color: "#64748b", fontSize: "11px", fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <button onClick={onLogout} style={{
                padding: "8px 14px", borderRadius: "10px",
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                color: "#f87171", fontSize: "12px", fontWeight: "600",
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                transition: "background 0.15s", whiteSpace: "nowrap", flexShrink: 0,
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
              >
                Sign Out
              </button>
            </div>

            {/* Row 2: Title + subtitle (centered) */}
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <h1 style={{
                fontSize: "clamp(22px, 3.5vw, 48px)", fontWeight: "800",
                background: "linear-gradient(120deg, #e2e8f0 0%, #818cf8 45%, #34d399 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0,
                fontFamily: "'Syne', sans-serif",
              }}>
                ATS Resume Pro
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "6px" }}>
                Upload · Analyze · Get ATS-Optimized Resume
              </p>
            </div>

            {/* Row 3: View History button (centered, below heading) */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={() => setShowHistory(true)} style={{
                padding: "9px 24px", borderRadius: "10px",
                background: "rgba(255,255,255,0.04)", border: "1px solid #1e2748",
                color: "#94a3b8", fontSize: "13px", fontWeight: "600",
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                display: "inline-flex", alignItems: "center", gap: "7px",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              >
                <span style={{ fontSize: "16px" }}>📂</span> View History
              </button>
            </div>

          </div>
          {/* ── END HEADER ─────────────────────────────────────────────── */}

          {/* ── INPUTS ─────────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
            {/* Upload card */}
            <div style={{ ...S.card, padding: "24px" }}>
              <div style={S.label}>📄 Resume (PDF only)</div>
              <div
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                style={{
                  border: `2px dashed ${dragOver ? "#6366f1" : file ? "rgba(52,211,153,.5)" : "#1e2748"}`,
                  borderRadius: "12px", padding: "32px 20px", cursor: "pointer",
                  textAlign: "center", transition: "all .2s",
                  background: dragOver ? "rgba(99,102,241,.05)" : file ? "rgba(52,211,153,.03)" : "rgba(255,255,255,.01)",
                }}>
                <input ref={fileRef} type="file" accept="application/pdf"
                  style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{file ? "✅" : "⬆️"}</div>
                {file
                  ? <>
                      <p style={{ color: "#34d399", fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>{file.name}</p>
                      <p style={{ color: "#64748b", fontSize: "11px" }}>{(file.size / 1024).toFixed(0)} KB · PDF</p>
                    </>
                  : <>
                      <p style={{ color: "#e2e8f0", fontWeight: "600", marginBottom: "6px" }}>Drop your resume here</p>
                      <p style={{ color: "#64748b", fontSize: "12px" }}>or click to browse · PDF only · max 5 MB</p>
                    </>
                }
              </div>
              {file && (
                <button onClick={() => { setFile(null); setFileURL(""); setResult(null); }}
                  style={{ marginTop: "10px", background: "none", border: "1px solid #1e2748", borderRadius: "8px", color: "#64748b", fontSize: "12px", padding: "5px 13px", cursor: "pointer" }}>
                  ✕ Remove file
                </button>
              )}
            </div>

            {/* JD card */}
            <div style={{ ...S.card, padding: "22px", display: "flex", flexDirection: "column" }}>
              <div style={S.label}>📋 Job Description</div>
              <textarea
                value={jd} onChange={e => setJd(e.target.value)}
                placeholder={"Paste the full job description here...\n\nThe AI will extract required skills, keywords, and tailor your resume to maximize your ATS score for this specific role."}
                style={{ ...S.textarea, flex: 1, minHeight: "220px" }}
              />
              {jd && <div style={{ marginTop: "8px", fontSize: "11px", color: "#64748b", fontFamily: "'DM Mono',monospace" }}>{jd.trim().split(/\s+/).length} words</div>}
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,.22)", borderRadius: "10px", padding: "13px 18px", marginBottom: "18px", color: "#f87171", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={loading} className="analyze-btn"
            style={{ ...S.btnMain, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer", marginBottom: "48px" }}>
            {loading
              ? <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Analyzing your resume — this takes ~15 seconds...
                </span>
              : "🚀  Analyze & Generate ATS-Optimized Resume"
            }
          </button>

          {/* ── RESULTS ──────────────────────────────────────────────────── */}
          {result && (
            <div ref={resultsRef} style={{ animation: "fadeUp .5s ease" }}>
              {/* Score bar */}
              <div style={{ ...S.card, padding: "28px 32px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "20px", flexShrink: 0 }}>
                  <ScoreRing value={result.ats_score       || 0} label="ATS Score" color="#818cf8" />
                  <ScoreRing value={result.job_match_score || 0} label="Job Match" color="#34d399" />
                </div>
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px", color: "#e2e8f0", fontFamily: "'Syne',sans-serif" }}>
                    {(result.ats_score || 0) >= 85 ? "🎯 Excellent — Top Candidate Match"
                     : (result.ats_score || 0) >= 70 ? "✅ Good ATS Match"
                     : (result.ats_score || 0) >= 50 ? "⚠️ Needs Improvement"
                     : "❌ Low ATS Score — Needs Major Work"}
                  </h2>
                  <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: "1.7", marginBottom: "16px" }}>{result.summary_verdict}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                    {(result.ats_score || 0) >= 70           && <Chip type="match">ATS Optimized</Chip>}
                    {(result.job_match_score || 0) >= 65     && <Chip type="match">Strong Role Fit</Chip>}
                    {(result.missing_keywords || []).length > 0 && <Chip type="added">{result.missing_keywords.length} Skills Added</Chip>}
                    {(result.matched_keywords || []).length > 0 && <Chip type="neutral">{result.matched_keywords.length} Keywords Matched</Chip>}
                    <Chip type={(result.ats_score || 0) >= 65 ? "match" : "miss"}>
                      {(result.ats_score || 0) >= 65 ? "Interview Ready" : "Needs Work"}
                    </Chip>
                  </div>
                </div>
              </div>

              {/* Keywords grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div style={{ ...S.card, padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ ...S.secBar, background: "linear-gradient(180deg,#34d399,#059669)" }} />
                    <h3 style={{ ...S.secLbl, color: "#34d399" }}>✓ Matched Keywords</h3>
                  </div>
                  <div>{(result.matched_keywords || []).map((k, i) => <Chip key={i} type="match">{k}</Chip>)}</div>
                </div>
                <div style={{ ...S.card, padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ ...S.secBar, background: "linear-gradient(180deg,#f87171,#dc2626)" }} />
                    <h3 style={{ ...S.secLbl, color: "#f87171" }}>✗ Missing Keywords (Added ★)</h3>
                  </div>
                  <div>{(result.missing_keywords || []).map((k, i) => <Chip key={i} type="miss">{k}</Chip>)}</div>
                </div>
              </div>

              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <div style={{ ...S.card, padding: "22px", marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <span style={S.secBar} />
                    <h3 style={S.secLbl}>⚡ Specific Improvements Applied</h3>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {result.improvements.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "10px 12px", background: "rgba(99,102,241,0.05)", borderRadius: "8px", border: "1px solid rgba(99,102,241,0.1)" }}>
                        <span style={{ color: "#6366f1", flexShrink: 0, marginTop: "1px" }}>→</span>
                        <span style={{ color: "#94a3b8", fontSize: "12.5px", lineHeight: "1.6" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Before / After resume */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ ...S.card, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #1e2748", ...S.label, marginBottom: 0 }}>Original Resume</div>
                  {fileURL
                    ? <iframe src={fileURL} title="Original PDF" style={{ width: "100%", height: "680px", border: "none", background: "#fff" }} />
                    : <p style={{ padding: "24px", color: "#64748b", fontSize: "13px" }}>No preview available.</p>
                  }
                </div>
                <div style={{ ...S.card, overflow: "hidden" }}>
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e2748", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ ...S.label, marginBottom: 0, color: "#34d399" }}>✨ ATS-Optimized Resume</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={handleCopy} style={S.btnSm(copied ? "#059669" : "#1e2748")}>{copied ? "✓ Copied!" : "Copy Text"}</button>
                      <button onClick={() => printResume(result.resume)} style={S.btnSm("linear-gradient(135deg,#6366f1,#4f46e5)")}>⬇ Download PDF</button>
                    </div>
                  </div>
                  <div style={{ padding: "18px", overflowY: "auto", maxHeight: "680px" }}>
                    <div id="resumePreviewText"><ResumePreview r={result.resume} /></div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "24px", padding: "14px 20px", borderRadius: "10px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>💡</span>
                <p style={{ color: "#94a3b8", fontSize: "12.5px", lineHeight: "1.7" }}>
                  <strong style={{ color: "#fbbf24" }}>Pro tip:</strong> Skills marked with * (blue italic) were added to match the job description.
                  Review them and only keep ones you genuinely have experience with.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROOT — handles auth state
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]         = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token      = getToken();
    const storedUser = getUser();
    if (!token || !storedUser) { setChecking(false); return; }

    authFetch(`${API_URL}/auth/me`)
      .then(r => r.json())
      .then(data => {
        if (data.success) { setUser(storedUser); }
        else { clearToken(); clearUser(); }
      })
      .catch(() => { setUser(storedUser); })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin  = (userData) => setUser(userData);
  const handleLogout = () => { clearToken(); clearUser(); setUser(null); };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#05060f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <AuthPage onLogin={handleLogin} />;
  return <MainApp user={user} onLogout={handleLogout} />;
}
