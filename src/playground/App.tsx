import React from "react";
import {
  DebugProvider,
  DebugScreen,
  useDebug,
  useDebugLogoTap,
  TYPE_COLORS,
} from "../debug";

const baseBtn: React.CSSProperties = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 14,
  fontWeight: 600,
};

function DebugTrigger() {
  const { logEvent } = useDebug();
  const handleLogoTap = useDebugLogoTap();

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 520,
      }}
    >
      {/* Logo area — tap 5 times rápido para abrir el panel */}
      <div
        onClick={handleLogoTap}
        title="Toca 5 veces seguidas para abrir el panel de debug"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          userSelect: "none",
          padding: "8px 12px",
          borderRadius: 8,
          border: "2px dashed #94a3b8",
          width: "fit-content",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#64748b">
          <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17a6.003 6.003 0 0 0-2.84 0L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
        </svg>
        <span style={{ color: "#64748b", fontSize: 13 }}>
          Logo (5 taps → debug)
        </span>
      </div>

      <h2 style={{ margin: 0 }}>DebugLog Playground</h2>
      <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
        Pulsa el logo 5 veces en menos de 2 s, o usa{" "}
        <kbd
          style={{
            background: "#e2e8f0",
            padding: "1px 5px",
            borderRadius: 4,
            fontFamily: "monospace",
          }}
        >
          Ctrl+Shift+D
        </kbd>
        , para abrir/cerrar el panel.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button
          type="button"
          style={{ ...baseBtn, background: TYPE_COLORS.INFO, color: "#fff" }}
          onClick={() =>
            logEvent("INFO", "Mensaje informativo", { ts: Date.now() })
          }
        >
          Log INFO
        </button>
        <button
          type="button"
          style={{ ...baseBtn, background: TYPE_COLORS.API, color: "#fff" }}
          onClick={() =>
            logEvent("API", "GET /api/users", { status: 200, count: 42 })
          }
        >
          Log API
        </button>
        <button
          type="button"
          style={{ ...baseBtn, background: TYPE_COLORS.ERROR, color: "#fff" }}
          onClick={() =>
            logEvent("ERROR", "Something went wrong", {
              code: 500,
              trace: "Error: null ref",
            })
          }
        >
          Log ERROR
        </button>
        <button
          type="button"
          style={{ ...baseBtn, background: TYPE_COLORS.NAV, color: "#fff" }}
          onClick={() =>
            logEvent("NAV", "Navigated to /home", { from: "/login" })
          }
        >
          Log NAV
        </button>
        <button
          type="button"
          style={{ ...baseBtn, background: TYPE_COLORS.ACTION, color: "#fff" }}
          onClick={() =>
            logEvent("ACTION", "Button clicked", {
              id: "submit-btn",
              label: "Enviar",
            })
          }
        >
          Log ACTION
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DebugProvider>
      <DebugTrigger />
      <DebugScreen />
    </DebugProvider>
  );
}
