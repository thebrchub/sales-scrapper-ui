type TooltipSide = "top" | "right";
type TooltipTone = "default" | "danger";

const SIDE_CLASSES: Record<TooltipSide, string> = {
  top: "left-1/2 bottom-full mb-2 -translate-x-1/2",
  right: "left-full top-1/2 ml-4 -translate-y-1/2",
};

const TONE_CLASSES: Record<TooltipTone, string> = {
  default: "text-white",
  danger: "text-red-400",
};

export default function Tooltip({
  label,
  side = "top",
  tone = "default",
}: {
  label: string;
  side?: TooltipSide;
  tone?: TooltipTone;
}) {
  return (
    <span
      className={`absolute ${SIDE_CLASSES[side]} px-3 py-1.5 bg-[#121214] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.8)] ${TONE_CLASSES[tone]} text-xs font-extrabold tracking-wide rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none`}
    >
      {label}
    </span>
  );
}
