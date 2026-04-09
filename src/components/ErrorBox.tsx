import { AlertTriangle } from "lucide-react";

interface Props {
  message?: string;
}

export default function ErrorBox({ message }: Props) {
  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-red-500/20 bg-red-500/10 backdrop-blur-md p-5 shadow-[0_8px_30px_-12px_rgba(239,68,68,0.25)] animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="p-2 bg-red-500/20 rounded-lg shrink-0 mt-0.5">
        <AlertTriangle className="text-red-400" size={18} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-red-400 mb-0.5">System Error</h4>
        <p className="text-sm text-red-200/80 leading-relaxed">
          {message || "An unexpected error occurred while processing your request. Please try again."}
        </p>
      </div>
    </div>
  );
}