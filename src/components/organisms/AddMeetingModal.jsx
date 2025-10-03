import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";

const AddMeetingModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    time: "",
    title: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd(formData);
    setFormData({ time: "", title: "", description: "" });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({ time: "", title: "", description: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />
        
        <motion.div
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <ApperIcon name="Calendar" size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Add Meeting
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Time" required error={errors.time}>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  error={!!errors.time}
                />
              </FormField>

              <FormField label="Title" required error={errors.title}>
                <Input
                  type="text"
                  placeholder="Meeting title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={!!errors.title}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  placeholder="Meeting description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </FormField>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Meeting
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMeetingModal;