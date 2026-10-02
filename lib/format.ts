export function formatScore(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value);
}

export function formatDuration(totalSeconds: number | null) {
  if (totalSeconds == null) return "Chưa nhập";
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
