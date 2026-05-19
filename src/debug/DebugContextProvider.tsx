import React from "react";
import {
  dbAddEvent,
  dbGetAllEvents,
  dbClearEvents,
  dbPurgeOldEvents,
} from "./DebugDB";
import type { DebugProviderProps, DebugEvent, EventType } from "./DebugTypes";
import {
  LOGS_ENABLED_KEY,
  MAX_LOG_AGE_DAYS,
  MAX_LOG_RECORDS,
} from "./DebugTypes";
import { DebugContext } from "./DebugContext";

export const DebugProvider = ({ children }: DebugProviderProps) => {
  const [events, setEvents] = React.useState<DebugEvent[]>([]);
  const [showDebug, setShowDebug] = React.useState(false);
  const [logsEnabled, setLogsEnabledState] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(LOGS_ENABLED_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  // Atajo de teclado: Ctrl+Shift+D abre/cierra el panel
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setShowDebug((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Al montar: purgar eventos viejos y luego cargar lo que queda
  React.useEffect(() => {
    dbPurgeOldEvents(MAX_LOG_AGE_DAYS, MAX_LOG_RECORDS)
      .catch(() => {
        console.error("Could not purge old events from the database");
      })
      .finally(() => {
        dbGetAllEvents()
          .then((storedEvents) => setEvents(storedEvents))
          .catch(() => {
            console.error("Could not load events from the database");
          });
      });
  }, []);

  const setLogsEnabled = React.useCallback((value: boolean) => {
    setLogsEnabledState(value);
    try {
      localStorage.setItem(LOGS_ENABLED_KEY, String(value));
    } catch {
      console.error("Could not save logs enabled state to localStorage");
    }
  }, []);

  const logEvent = React.useCallback(
    (type: EventType, message: string, data: unknown = null) => {
      if (!logsEnabled) return;
      const event: DebugEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString(),
        type,
        message,
        data,
      };
      dbAddEvent(event).catch(() => {
        console.error("Could not add event to the database");
      });
      setEvents((prev) => [...prev, event]);
    },
    [logsEnabled],
  );

  const clearEvents = React.useCallback(() => {
    dbClearEvents().catch(() => {
      console.error("Could not clear events from the database");
    });
    setEvents([]);
  }, []);

  return (
    <DebugContext.Provider
      value={{
        events,
        logEvent,
        showDebug,
        setShowDebug,
        clearEvents,
        logsEnabled,
        setLogsEnabled,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};
