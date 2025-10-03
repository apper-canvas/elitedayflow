import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DateNavigation from "@/components/organisms/DateNavigation";
import MeetingSection from "@/components/organisms/MeetingSection";
import TodoSection from "@/components/organisms/TodoSection";
import RoutineSection from "@/components/organisms/RoutineSection";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { noteService } from "@/services/api/noteService";
import { dateUtils } from "@/utils/dateUtils";

const HomePage = () => {
  const [currentDate, setCurrentDate] = useState(dateUtils.getToday());
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError(null);
      const dateString = dateUtils.formatDate(currentDate);
      const note = await noteService.getNoteForDate(dateString);
      setCurrentNote(note);
    } catch (err) {
      setError(err.message || "Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNote();
  }, [currentDate]);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleNoteUpdate = (updatedNote) => {
    setCurrentNote(updatedNote);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadNote} />;
  if (!currentNote) return null;

  const dateString = dateUtils.formatDate(currentDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <DateNavigation
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />

        <motion.div
          className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[calc(100vh-240px)]">
            <MeetingSection
              dateString={dateString}
              meetings={currentNote.meetings}
              onUpdate={handleNoteUpdate}
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[calc(100vh-240px)]">
            <TodoSection
              dateString={dateString}
              todos={currentNote.todos}
              onUpdate={handleNoteUpdate}
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[calc(100vh-240px)]">
            <RoutineSection
              dateString={dateString}
              routines={currentNote.routines}
              onUpdate={handleNoteUpdate}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;