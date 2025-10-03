import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Card = forwardRef(({ 
  children, 
  className,
  hoverable = false,
  ...props 
}, ref) => {
  const Component = hoverable ? motion.div : "div";
  
  return (
    <Component
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        hoverable && "transition-shadow duration-200",
        className
      )}
      whileHover={hoverable ? { y: -2, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;