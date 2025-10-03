import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Checkbox = forwardRef(({ 
  className,
  checked = false,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.div
      className="relative inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          "w-5 h-5 border-2 rounded transition-all duration-200 cursor-pointer",
          "flex items-center justify-center",
          checked 
            ? "bg-gradient-to-br from-primary-500 to-primary-600 border-primary-600" 
            : "border-slate-300 hover:border-slate-400",
          className
        )}
        onClick={() => onChange?.({ target: { checked: !checked } })}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "backOut" }}
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </div>
    </motion.div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;