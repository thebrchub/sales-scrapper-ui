import { AlertCircle } from "lucide-react";

interface Props {
  message?: string;
}

export default function ErrorBox({ message }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
      <AlertCircle size={18} />
      {message || "Something went wrong"}
    </div>
  );
}
