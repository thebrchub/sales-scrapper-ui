interface Props {
  value: number;
  label?: string;
  color?: string;
}

export default function ScoreBadge({ value, label, color }: Props) {
  // Syncing with our dashboard telemetry colors
  const isHot = value >= 70;
  const isWarm = value >= 40 && value < 70;

  const defaultColor = isHot ? "text-red-400" : isWarm ? "text-amber-400" : "text-blue-400";
  const shadowColor = isHot ? "rgba(248,113,113,0.5)" : isWarm ? "rgba(251,191,36,0.5)" : "rgba(96,165,250,0.5)";

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-black tracking-tight ${color || defaultColor}`}>
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{
          backgroundColor: "currentColor",
          boxShadow: `0 0 10px ${shadowColor}`,
        }}
      />
      {value}
      {label && <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest ml-0.5">/ {label}</span>}
    </span>
  );
}