import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-primary-100 text-primary-700",
    secondary: "bg-secondary-100 text-secondary-700",
    accent: "bg-accent-100 text-accent-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    upcoming: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-slate-100 text-slate-600"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;