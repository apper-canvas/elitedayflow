import { format, addDays, subDays, isToday, parseISO } from "date-fns";

export const dateUtils = {
  formatDate: (date) => format(date, "yyyy-MM-dd"),
  
  formatDisplayDate: (date) => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "EEEE, MMMM d, yyyy");
  },
  
  getToday: () => new Date(),
  
  getTodayString: () => format(new Date(), "yyyy-MM-dd"),
  
  addDays: (date, days) => addDays(date, days),
  
  subDays: (date, days) => subDays(date, days),
  
  parseDate: (dateString) => parseISO(dateString),
  
  formatTime: (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
};