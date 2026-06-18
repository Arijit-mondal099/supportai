"use client";

interface BaseProps {
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

interface InputProps extends BaseProps {
  type: "text" | "email" | "password" | "number" | "url" | "tel" | "search" | "textarea";
  value?: string;
  defaultValue?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  placeholder,
  hint,
  error,
  required,
  disabled,
  type,
  rows = 4,
  rightElement,
  ...rest
}) => {
  const hasError = !!error;

  const wrapperClass = `
    flex items-center gap-2 w-full rounded-xl border px-3.5 transition-all duration-200
    ${hasError ? "border-rose-300 focus-within:ring-2 focus-within:ring-rose-100" : "border-slate-200 focus-within:ring-2 focus-within:ring-slate-900/10"}
    ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "bg-white"}
  `;

  const inputClass = `flex-1 bg-transparent py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none`;

  return (
    <div className="w-full">
      <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-500">
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>

      <div className={wrapperClass}>
        {icon && (
          <span
            className={`flex items-center justify-center text-slate-400
              ${hasError ? "text-rose-400" : ""}`}
          >
            {icon}
          </span>
        )}

        {type === "textarea" ? (
          <textarea
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${inputClass} resize-none`}
            {...rest}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClass}
            {...rest}
          />
        )}

        {rightElement && <span className="flex items-center text-slate-400">{rightElement}</span>}
      </div>

      {(error || hint) && (
        <p className={`mt-1.5 text-xs ${error ? "text-rose-500" : "text-slate-400"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
};
