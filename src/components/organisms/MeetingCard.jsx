import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { dateUtils } from "@/utils/dateUtils";

const MeetingCard = ({ meeting, onDelete, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "active";
      case "completed":
        return "completed";
      default:
        return "upcoming";
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
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-2 text-primary-600">
                <ApperIcon name="Clock" size={16} />
                <span className="text-sm font-semibold">
                  {dateUtils.formatTime(meeting.time)}
                </span>
              </div>
              <Badge variant={getStatusColor(meeting.status)}>
                {meeting.status}
              </Badge>
            </div>
            
            <h4 className="font-semibold text-slate-900 mb-1 truncate">
              {meeting.title}
            </h4>
            
            {meeting.description && (
              <p className="text-sm text-slate-600 line-clamp-2">
                {meeting.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {meeting.status === "upcoming" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateStatus(meeting.id, "active")}
                className="px-2"
                title="Mark as active"
              >
                <ApperIcon name="Play" size={16} className="text-green-600" />
              </Button>
            )}
            {meeting.status === "active" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateStatus(meeting.id, "completed")}
                className="px-2"
                title="Mark as completed"
              >
                <ApperIcon name="Check" size={16} className="text-slate-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(meeting.id)}
              className="px-2 hover:bg-red-50"
              title="Delete meeting"
            >
              <ApperIcon name="Trash2" size={16} className="text-red-500" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MeetingCard;