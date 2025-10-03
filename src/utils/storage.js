const STORAGE_KEY = "dayflow_data";

export const storageUtils = {
  getData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { notes: {} };
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return { notes: {} };
    }
  },

  saveData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  getNoteForDate: (dateString) => {
    const data = storageUtils.getData();
    return data.notes[dateString] || null;
  },

  saveNoteForDate: (dateString, note) => {
    const data = storageUtils.getData();
    data.notes[dateString] = note;
    storageUtils.saveData(data);
  }
};