interface Props {
  status: string;
}

const COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400",
  contacted: "bg-amber-500/15 text-amber-400",
  qualified: "bg-purple-500/15 text-purple-400",
  converted: "bg-emerald-500/15 text-emerald-400",
  closed: "bg-red-500/15 text-red-400",
  pending: "bg-slate-500/15 text-slate-400",
  running: "bg-cyan-500/15 text-cyan-400",
  completed: "bg-emerald-500/15 text-emerald-400",
  failed: "bg-red-500/15 text-red-400",
  dead: "bg-red-500/15 text-red-400",
  active: "bg-emerald-500/15 text-emerald-400",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        COLORS[status] || "bg-slate-500/15 text-slate-400"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
