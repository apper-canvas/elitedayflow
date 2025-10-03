import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { noteService } from "@/services/api/noteService";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import RoutineItem from "@/components/organisms/RoutineItem";

const RoutineSection = ({ dateString, routines, onUpdate }) => {
const handleToggleRoutine = async (routineId, completed_c) => {
    try {
await noteService.updateRoutine(dateString, routineId, { completed_c });
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      if (completed_c) {
        toast.success("Routine completed! Keep the streak going! 🔥");
      }
    } catch (error) {
      toast.error("Failed to update routine");
    }
  };

const completedCount = routines.filter(r => r.completed_c).length;
  const totalStreak = routines.reduce((sum, r) => sum + (r.streak_c || 0), 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
            <ApperIcon name="RefreshCw" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Routine</h2>
            <p className="text-sm text-slate-600">
              {completedCount} of {routines.length} completed
            </p>
          </div>
        </div>
        {totalStreak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-accent-100 to-amber-100 rounded-lg">
            <ApperIcon name="Flame" size={16} className="text-accent-600" />
            <span className="text-sm font-semibold text-accent-700">
              {totalStreak} total
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {routines.length === 0 ? (
            <Empty
              icon="RefreshCw"
              title="No routines set"
              description="Daily routines help build consistent habits"
            />
          ) : (
            routines.map((routine) => (
              <RoutineItem
                key={routine.id}
                routine={routine}
                onToggle={handleToggleRoutine}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoutineSection;