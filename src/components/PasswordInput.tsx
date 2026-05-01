import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import Tooltip from "./Tooltip";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  inputClassName?: string;
}

export default function PasswordInput({ className = "", inputClassName = "", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${inputClassName} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="group absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <Icon size={16} />
        <Tooltip label={visible ? "Hide password" : "Show password"} />
      </button>
    </div>
  );
}
