import React from "react";
import type { DebugContextValue } from "./DebugTypes";

export const DebugContext = React.createContext<DebugContextValue>({
  events: [],
  logEvent: () => {},
  showDebug: false,
  setShowDebug: () => {},
  clearEvents: () => {},
  logsEnabled: true,
  setLogsEnabled: () => {},
});

export const useDebug = () => React.useContext(DebugContext);
