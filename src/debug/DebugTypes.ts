import React from "react";

// ── DebugDB ───────────────────────────────────────────────────────────────────
export type EventType = "API" | "NAV" | "ERROR" | "ACTION" | "INFO";

export interface DebugEvent {
  id: string;
  timestamp: string;
  type: EventType;
  message: string;
  data: unknown;
}

// ── DebugContext ──────────────────────────────────────────────────────────────
export interface DebugContextValue {
  events: DebugEvent[];
  logEvent: (type: EventType, message: string, data?: unknown) => void;
  showDebug: boolean;
  setShowDebug: React.Dispatch<React.SetStateAction<boolean>>;
  clearEvents: () => void;
  logsEnabled: boolean;
  setLogsEnabled: (value: boolean) => void;
}

export interface DebugProviderProps {
  children: React.ReactNode;
}

// ── DebugIcons ───────────────────────────────────────────────────────────────
export interface IconProps {
  style?: React.CSSProperties;
}

// ── Constants ─────────────────────────────────────────────────────────────────
// DebugDB
export const DB_NAME = "attendance_debug";
export const DB_VERSION = 1;
export const STORE_NAME = "events";

// DebugContextProvider
export const LOGS_ENABLED_KEY = "debug_logs_enabled";
export const MAX_LOG_AGE_DAYS = 3;
export const MAX_LOG_RECORDS = 2000;

// DebugContextHooks
export const TAP_THRESHOLD = 5;
export const TAP_WINDOW_MS = 2000;

// DebugScreen
export const TYPE_COLORS: Record<EventType, string> = {
  API: "#1976d2",
  NAV: "#7b1fa2",
  ERROR: "#d32f2f",
  ACTION: "#388e3c",
  INFO: "#546e7a",
};
export const ALL_TYPES: EventType[] = ["API", "NAV", "ACTION", "ERROR", "INFO"];
