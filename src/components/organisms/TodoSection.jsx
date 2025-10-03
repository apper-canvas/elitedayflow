import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import QuickAddBar from "@/components/molecules/QuickAddBar";
import TodoItem from "@/components/organisms/TodoItem";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";

const TodoSection = ({ dateString, todos, onUpdate }) => {
  const handleQuickAdd = async (text) => {
try {
      await noteService.addTodo(dateString, { text_c: text, priority_c: "medium" });
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      toast.success("Todo added!");
    } catch (error) {
      toast.error("Failed to add todo");
    }
  };

  const handleToggleTodo = async (todoId, completed) => {
    try {
await noteService.updateTodo(dateString, todoId, { completed_c: completed });
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      if (completed) {
        toast.success("Todo completed! 🎉");
      }
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await noteService.deleteTodo(dateString, todoId);
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      toast.success("Todo deleted");
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const handlePriorityChange = async (todoId, priority) => {
    try {
await noteService.updateTodo(dateString, todoId, { priority_c: priority });
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const handleClearCompleted = async () => {
    try {
      await noteService.clearCompletedTodos(dateString);
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      toast.success("Completed todos cleared");
    } catch (error) {
      toast.error("Failed to clear todos");
    }
  };

const completedCount = todos.filter(t => t.completed_c).length;
  const hasCompleted = completedCount > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Todos</h2>
            <p className="text-sm text-slate-600">
              {completedCount} of {todos.length} completed
            </p>
          </div>
        </div>
        {hasCompleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCompleted}
            className="text-slate-600"
          >
            <ApperIcon name="Trash2" size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="mb-4">
        <QuickAddBar
          placeholder="Add a new todo..."
          onAdd={handleQuickAdd}
          color="secondary"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {todos.length === 0 ? (
            <Empty
              icon="CheckSquare"
              title="No todos yet"
              description="Start organizing your day by adding tasks"
            />
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onPriorityChange={handlePriorityChange}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoSection;