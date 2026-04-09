import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  accent?: boolean;
}

export default function StatCard({ title, value, icon, trend, accent }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border p-5 transition-colors ${
        accent
          ? "border-accent-start/30 bg-gradient-to-br from-accent-start/5 to-accent-end/5"
          : "border-border-default bg-surface-card hover:border-border-default/80"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-accent-start">{trend}</p>
          )}
        </div>
        <div className="rounded-lg bg-surface-hover p-2.5 text-text-secondary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
