interface Props {
  value: number;
  max?: number;
  label?: string;
  color?: string;
}

export default function ScoreBadge({ value, max = 100, label, color }: Props) {
  const pct = Math.round((value / max) * 100);
  const defaultColor =
    value >= 70 ? "text-success" : value >= 40 ? "text-warning" : "text-text-muted";

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${color || defaultColor}`}>
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{
          backgroundColor: "currentColor",
          opacity: pct / 100,
        }}
      />
      {value}
      {label && <span className="text-text-muted text-xs">/ {label}</span>}
    </span>
  );
}
