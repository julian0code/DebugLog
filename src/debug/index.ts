// Componentes
export { default as DebugScreen } from "./DebugScreen";
export { DebugProvider } from "./DebugContextProvider";

// Hooks
export { useDebug } from "./DebugContext";
export { useDebugLogoTap } from "./DebugContextHooks";

// Tipos
export type {
  DebugEvent,
  EventType,
  DebugContextValue,
  DebugProviderProps,
} from "./DebugTypes";

// Constantes
export { TYPE_COLORS } from "./DebugTypes";
