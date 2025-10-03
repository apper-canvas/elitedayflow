import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import QuickAddBar from "@/components/molecules/QuickAddBar";
import MeetingCard from "@/components/organisms/MeetingCard";
import AddMeetingModal from "@/components/organisms/AddMeetingModal";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";
import { dateUtils } from "@/utils/dateUtils";

const MeetingSection = ({ dateString, meetings, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  const handleQuickAdd = (title) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    handleAddMeeting({ time: currentTime, title, description: "" });
  };

  const handleAddMeeting = async (meetingData) => {
    try {
      await noteService.addMeeting(dateString, meetingData);
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      toast.success("Meeting added successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to add meeting");
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await noteService.deleteMeeting(dateString, meetingId);
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      toast.success("Meeting deleted");
    } catch (error) {
      toast.error("Failed to delete meeting");
    }
  };

  const handleUpdateStatus = async (meetingId, status) => {
    try {
      await noteService.updateMeeting(dateString, meetingId, { status });
      const updatedNote = await noteService.getNoteForDate(dateString);
      onUpdate(updatedNote);
      toast.success(`Meeting marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update meeting");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <ApperIcon name="Calendar" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Meetings</h2>
            <p className="text-sm text-slate-600">
              {meetings.length} {meetings.length === 1 ? "meeting" : "meetings"} today
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowModal(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-1" />
          Add
        </Button>
      </div>

      <div className="mb-4">
        <QuickAddBar
          placeholder="Quick add meeting..."
          onAdd={handleQuickAdd}
          color="primary"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {meetings.length === 0 ? (
            <Empty
              icon="Calendar"
              title="No meetings scheduled"
              description="Add your first meeting to get started with your day"
              action={
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Meeting
                </Button>
              }
            />
          ) : (
            meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onDelete={handleDeleteMeeting}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <AddMeetingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddMeeting}
      />
    </div>
  );
};

export default MeetingSection;