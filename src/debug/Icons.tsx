// ── Inline SVG icons — Material Design paths ──────────────────────────────────

import type { IconProps } from "./DebugTypes";

const mkStyle = (overrides?: React.CSSProperties): React.CSSProperties => {
  const { fontSize, ...rest } = overrides ?? {};
  const size = fontSize ?? 24;
  return {
    width: size,
    height: size,
    fill: "currentColor",
    flexShrink: 0,
    ...rest,
  };
};

export const ArrowUpwardIcon = ({ style }: IconProps) => (
  <svg viewBox="0 0 24 24" style={mkStyle(style)} aria-hidden="true">
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
  </svg>
);

export const ArrowDownwardIcon = ({ style }: IconProps) => (
  <svg viewBox="0 0 24 24" style={mkStyle(style)} aria-hidden="true">
    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
  </svg>
);

export const CloseIcon = ({ style }: IconProps) => (
  <svg viewBox="0 0 24 24" style={mkStyle(style)} aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

export const DeleteIcon = ({ style }: IconProps) => (
  <svg viewBox="0 0 24 24" style={mkStyle(style)} aria-hidden="true">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

export const FileCopyIcon = ({ style }: IconProps) => (
  <svg viewBox="0 0 24 24" style={mkStyle(style)} aria-hidden="true">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);
// ──────────────────────────────────────────────────────────────────────────────
