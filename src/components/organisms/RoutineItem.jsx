import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Card from "@/components/atoms/Card";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const RoutineItem = ({ routine, onToggle }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggle = () => {
    if (!routine.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    onToggle(routine.id, !routine.completed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className="relative"
    >
      <Card hoverable className="p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={routine.completed}
            onChange={handleToggle}
          />

          <div className="flex-1 min-w-0">
            <span
              className={cn(
                "text-sm font-medium transition-all duration-200",
                routine.completed
                  ? "line-through text-slate-400"
                  : "text-slate-900"
              )}
            >
              {routine.title}
            </span>
          </div>

          {routine.streak > 0 && (
            <motion.div
              className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-accent-100 to-amber-100 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ApperIcon name="Flame" size={14} className="text-accent-600" />
              <span className="text-xs font-semibold text-accent-700">
                {routine.streak}
              </span>
            </motion.div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ["#f59e0b", "#10b981", "#3b82f6", "#7c3aed"][i % 4]
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 1 
                }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * 80,
                  y: Math.sin((i / 12) * Math.PI * 2) * 80,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoutineItem;