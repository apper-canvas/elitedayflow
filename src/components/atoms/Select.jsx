import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  children,
  error = false,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-sm bg-white border rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        error 
          ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
          : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
        "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;