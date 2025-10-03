import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const QuickAddBar = ({ placeholder, onAdd, color = "primary" }) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };

  const colorClasses = {
    primary: "border-primary-200 focus-within:border-primary-500 focus-within:ring-primary-500",
    secondary: "border-secondary-200 focus-within:border-secondary-500 focus-within:ring-secondary-500",
    accent: "border-accent-200 focus-within:border-accent-500 focus-within:ring-accent-500"
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn(
        "bg-white rounded-lg border-2 transition-all duration-200 p-3 focus-within:ring-2 focus-within:ring-offset-1",
        colorClasses[color]
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 border-0 focus:ring-0 px-0"
        />
        {value.trim() && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button type="submit" variant={color} size="sm">
              <ApperIcon name="Plus" size={16} />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.form>
  );
};

export default QuickAddBar;