import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { dateUtils } from "@/utils/dateUtils";

const DateNavigation = ({ currentDate, onDateChange }) => {
  const handlePrevDay = () => {
    const newDate = dateUtils.subDays(currentDate, 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = dateUtils.addDays(currentDate, 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(dateUtils.getToday());
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="md"
          onClick={handlePrevDay}
          className="px-3"
        >
          <ApperIcon name="ChevronLeft" size={20} />
        </Button>

        <div className="flex items-center gap-4 flex-1 justify-center">
          <ApperIcon name="Calendar" size={24} className="text-primary-600" />
          <h2 className="text-xl font-semibold text-slate-900">
            {dateUtils.formatDisplayDate(currentDate)}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="hidden sm:flex"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={handleNextDay}
            className="px-3"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DateNavigation;