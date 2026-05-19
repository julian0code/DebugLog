import React from "react";
import { DebugContext } from "./DebugContext";
import { TAP_THRESHOLD, TAP_WINDOW_MS } from "./DebugTypes";

/**
 * Hook que devuelve un onClick para poner en el logo.
 * 5 taps en menos de 2 segundos abren/cierran el panel de debug.
 */
export const useDebugLogoTap = () => {
  const { setShowDebug } = React.useContext(DebugContext);
  const tapsRef = React.useRef<number[]>([]);

  return React.useCallback(() => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current, now].filter(
      (t) => now - t < TAP_WINDOW_MS,
    );
    if (tapsRef.current.length >= TAP_THRESHOLD) {
      tapsRef.current = [];
      setShowDebug((prev) => !prev);
    }
  }, [setShowDebug]);
};
