import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import React from "react";
const TodoItem = ({ todo, onToggle, onDelete, onPriorityChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "None";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
    >
      <Card hoverable className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            <Checkbox
              checked={todo.completed}
              onChange={() => onToggle(todo.id, !todo.completed)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "text-sm font-medium transition-all duration-200",
                  todo.completed
                    ? "line-through text-slate-400"
                    : "text-slate-900"
                )}
              >
                {todo.text}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor(todo.priority)}>
                {getPriorityLabel(todo.priority)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <select
              value={todo.priority}
              onChange={(e) => onPriorityChange(todo.id, e.target.value)}
              className="text-xs px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(todo.id)}
              className="px-2 hover:bg-red-50"
              title="Delete todo"
            >
              <ApperIcon name="Trash2" size={16} className="text-red-500" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TodoItem;