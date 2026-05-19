export const formatTime = (isoString: string): string => {
  const d = new Date(isoString);
  return (
    [
      d.getHours().toString().padStart(2, "0"),
      d.getMinutes().toString().padStart(2, "0"),
      d.getSeconds().toString().padStart(2, "0"),
    ].join(":") +
    "." +
    d.getMilliseconds().toString().padStart(3, "0")
  );
};

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text).catch(() => {
    console.error("Failed to copy to clipboard");
  });
};
