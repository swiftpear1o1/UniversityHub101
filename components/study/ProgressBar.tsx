export function ProgressBar({ value, color = "#2563eb", className = "" }: { value: number; color?: string; className?: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-slate-100 ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${safeValue}%`, backgroundColor: color }} />
    </div>
  );
}
