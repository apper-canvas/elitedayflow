import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-2.5 text-sm bg-white border rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "placeholder:text-slate-400",
        error 
          ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
          : "border-slate-300 focus:border-primary-500 focus:ring-primary-500",
        "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;