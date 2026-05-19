import React from "react";
import { useDebug } from "./DebugContext";
import { ALL_TYPES, TYPE_COLORS, type EventType } from "./DebugTypes";
import { copyToClipboard, formatTime } from "./Utils";
import {
  FileCopyIcon,
  DeleteIcon,
  CloseIcon,
  ArrowUpwardIcon,
  ArrowDownwardIcon,
} from "./Icons";

export default function DebugScreen() {
  const {
    events,
    clearEvents,
    showDebug,
    setShowDebug,
    logsEnabled,
    setLogsEnabled,
  } = useDebug();

  const [activeFilter, setActiveFilter] = React.useState<EventType | "ALL">(
    "ALL",
  );
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const listRef = React.useRef<HTMLDivElement>(null);

  const filteredEvents = React.useMemo(() => {
    let result =
      activeFilter === "ALL"
        ? events
        : events.filter((e) => e.type === activeFilter);

    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (e) =>
          e.message.toLowerCase().includes(lower) ||
          (e.data && JSON.stringify(e.data).toLowerCase().includes(lower)),
      );
    }

    return sortOrder === "desc" ? [...result].reverse() : result;
  }, [events, activeFilter, searchText, sortOrder]);

  // Auto-scroll al último evento (solo en orden ascendente sin búsqueda activa)
  React.useEffect(() => {
    if (sortOrder === "asc" && !searchText && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [filteredEvents.length, sortOrder, searchText]);

  if (!showDebug) return null;

  const handleCopy = () => {
    const text = events
      .map(
        (e) =>
          `[${e.timestamp}] [${e.type}] ${e.message}${
            e.data ? "\n  " + JSON.stringify(e.data, null, 2) : ""
          }`,
      )
      .join("\n");
    copyToClipboard(text);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0d1117",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Cabecera */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: "#e6edf3",
            fontSize: 16,
            fontWeight: 700,
            flexGrow: 1,
            fontFamily: "inherit",
          }}
        >
          🐛 Debug Log —{" "}
          <span style={{ color: "#8b949e", fontWeight: 400 }}>
            {events.length} eventos
          </span>
        </div>

        <div
          title="Activar/desactivar logs (también afecta a IndexedDB)"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginRight: 4,
          }}
        >
          <span
            style={{
              color: logsEnabled ? "#3fb950" : "#8b949e",
              fontSize: 11,
              fontFamily: "inherit",
            }}
          >
            {logsEnabled ? "LOGS ON" : "LOGS OFF"}
          </span>
          {/* Toggle switch */}
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={logsEnabled}
              onChange={(e) => setLogsEnabled(e.target.checked)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                display: "inline-block",
                width: 28,
                height: 16,
                borderRadius: 8,
                backgroundColor: logsEnabled ? "#3fb950" : "#484f58",
                position: "relative",
                transition: "background-color 0.2s",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: 2,
                  left: logsEnabled ? 14 : 2,
                  transition: "left 0.2s",
                }}
              />
            </span>
          </label>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#8b949e",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
          title="Copiar eventos (Ctrl+Shift+C)"
        >
          <FileCopyIcon style={{ fontSize: 18 }} />
        </button>
        <button
          type="button"
          onClick={clearEvents}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#8b949e",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
          title="Limpiar eventos (también borra IndexedDB)"
        >
          <DeleteIcon style={{ fontSize: 18 }} />
        </button>
        <button
          type="button"
          onClick={() => setShowDebug(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#8b949e",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
          title="Cerrar (Ctrl+Shift+D)"
        >
          <CloseIcon style={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Filtros */}
      <div
        style={{
          padding: "8px 16px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setActiveFilter("ALL")}
          style={{
            backgroundColor: activeFilter === "ALL" ? "#58a6ff" : "#21262d",
            color: activeFilter === "ALL" ? "#0d1117" : "#8b949e",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            border: "none",
            borderRadius: 16,
            padding: "2px 8px",
            fontSize: 12,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          TODOS
        </button>
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveFilter(type)}
            style={{
              backgroundColor:
                activeFilter === type ? TYPE_COLORS[type] : "#21262d",
              color: activeFilter === type ? "#fff" : "#8b949e",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              border: "none",
              borderRadius: 16,
              padding: "2px 8px",
              fontSize: 12,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {`${type} (${events.filter((e) => e.type === type).length})`}
          </button>
        ))}
      </div>

      {/* Búsqueda y ordenación */}
      <div
        style={{
          padding: "6px 12px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          placeholder="Buscar en mensajes y datos..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            flex: 1,
            color: "#e6edf3",
            fontSize: 13,
            fontFamily: "'Courier New', monospace",
            backgroundColor: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: 6,
            padding: "3px 10px",
            outline: "none",
            minWidth: 0,
          }}
        />
        {searchText && (
          <button
            type="button"
            onClick={() => setSearchText("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#8b949e",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
            title="Limpiar búsqueda"
          >
            <CloseIcon style={{ fontSize: 16 }} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: sortOrder === "desc" ? "#58a6ff" : "#8b949e",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
          title={
            sortOrder === "asc"
              ? "Más recientes al final — clic para invertir"
              : "Más recientes al inicio — clic para invertir"
          }
        >
          {sortOrder === "asc" ? (
            <ArrowUpwardIcon style={{ fontSize: 18 }} />
          ) : (
            <ArrowDownwardIcon style={{ fontSize: 18 }} />
          )}
        </button>
        {filteredEvents.length !== events.length && (
          <span
            style={{
              color: "#8b949e",
              fontSize: 11,
              fontFamily: "'Courier New', monospace",
              flexShrink: 0,
            }}
          >
            {filteredEvents.length}/{events.length}
          </span>
        )}
      </div>

      {/* Lista de eventos */}
      <div
        ref={listRef}
        style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}
      >
        {filteredEvents.length === 0 ? (
          <span
            style={{
              display: "block",
              color: "#8b949e",
              textAlign: "center",
              marginTop: 64,
              fontSize: 14,
              fontFamily: "inherit",
            }}
          >
            No hay eventos registrados
          </span>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => event.data != null && handleToggleExpand(event.id)}
              style={{
                padding: "5px 16px",
                cursor: event.data != null ? "pointer" : "default",
                borderBottom: "1px solid #21262d",
                backgroundColor:
                  expandedId === event.id ? "#161b22" : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    color: "#6e7681",
                    fontSize: 11,
                    minWidth: 96,
                    fontFamily: "inherit",
                    flexShrink: 0,
                  }}
                >
                  {formatTime(event.timestamp)}
                </span>
                <span
                  style={{
                    backgroundColor: TYPE_COLORS[event.type] ?? "#546e7a",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 4,
                    minWidth: 52,
                    textAlign: "center",
                    flexShrink: 0,
                    fontFamily: "inherit",
                  }}
                >
                  {event.type}
                </span>
                <span
                  style={{
                    color: "#e6edf3",
                    fontSize: 13,
                    flex: 1,
                    fontFamily: "inherit",
                  }}
                >
                  {event.message}
                </span>
                {event.data != null && (
                  <span
                    style={{
                      color: "#8b949e",
                      fontSize: 11,
                      flexShrink: 0,
                    }}
                  >
                    {expandedId === event.id ? "▲" : "▼"}
                  </span>
                )}
              </div>

              {/* Dato expandible */}
              {expandedId === event.id && event.data != null && (
                <pre
                  style={{
                    margin: "6px 0 4px 160px",
                    padding: "8px 12px",
                    backgroundColor: "#010409",
                    border: "1px solid #30363d",
                    borderRadius: 6,
                    color: "#79c0ff",
                    fontSize: 12,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    fontFamily: "inherit",
                  }}
                >
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pie */}
      <div
        style={{
          padding: "5px 16px",
          backgroundColor: "#161b22",
          borderTop: "1px solid #30363d",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "#6e7681",
            fontSize: 11,
            fontFamily: "inherit",
          }}
        >
          IndexedDB: <span style={{ color: "#3fb950" }}>attendance_debug</span>
        </span>
        <span
          style={{
            color: "#6e7681",
            fontSize: 11,
            fontFamily: "inherit",
          }}
        >
          Ctrl+Shift+D to open/close
        </span>
      </div>
    </div>
  );
}
