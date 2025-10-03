import { storageUtils } from "@/utils/storage";
import { dateUtils } from "@/utils/dateUtils";
import defaultRoutines from "@/services/mockData/routines.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const noteService = {
  getNoteForDate: async (dateString) => {
    await delay(300);
    const note = storageUtils.getNoteForDate(dateString);
    
    if (!note) {
      return {
        date: dateString,
        meetings: [],
        todos: [],
        routines: defaultRoutines.map(r => ({ ...r, id: `routine-${r.Id}` }))
      };
    }
    
    return note;
  },

  saveNote: async (dateString, note) => {
    await delay(200);
    storageUtils.saveNoteForDate(dateString, note);
    return note;
  },

  addMeeting: async (dateString, meeting) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    const newMeeting = {
      ...meeting,
      id: `meeting-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "upcoming"
    };
    note.meetings.push(newMeeting);
    note.meetings.sort((a, b) => a.time.localeCompare(b.time));
    storageUtils.saveNoteForDate(dateString, note);
    return newMeeting;
  },

  updateMeeting: async (dateString, meetingId, updates) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    const meetingIndex = note.meetings.findIndex(m => m.id === meetingId);
    if (meetingIndex !== -1) {
      note.meetings[meetingIndex] = { ...note.meetings[meetingIndex], ...updates };
      note.meetings.sort((a, b) => a.time.localeCompare(b.time));
      storageUtils.saveNoteForDate(dateString, note);
      return note.meetings[meetingIndex];
    }
    return null;
  },

  deleteMeeting: async (dateString, meetingId) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    note.meetings = note.meetings.filter(m => m.id !== meetingId);
    storageUtils.saveNoteForDate(dateString, note);
    return true;
  },

  addTodo: async (dateString, todo) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    const newTodo = {
      ...todo,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completed: false,
      order: note.todos.length
    };
    note.todos.push(newTodo);
    storageUtils.saveNoteForDate(dateString, note);
    return newTodo;
  },

  updateTodo: async (dateString, todoId, updates) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    const todoIndex = note.todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
      note.todos[todoIndex] = { ...note.todos[todoIndex], ...updates };
      storageUtils.saveNoteForDate(dateString, note);
      return note.todos[todoIndex];
    }
    return null;
  },

  deleteTodo: async (dateString, todoId) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    note.todos = note.todos.filter(t => t.id !== todoId);
    storageUtils.saveNoteForDate(dateString, note);
    return true;
  },

  reorderTodos: async (dateString, todos) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    note.todos = todos.map((todo, index) => ({ ...todo, order: index }));
    storageUtils.saveNoteForDate(dateString, note);
    return note.todos;
  },

  updateRoutine: async (dateString, routineId, updates) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    const routineIndex = note.routines.findIndex(r => r.id === routineId);
    if (routineIndex !== -1) {
      const routine = note.routines[routineIndex];
      const updatedRoutine = { ...routine, ...updates };
      
      if (updates.completed !== undefined) {
        if (updates.completed) {
          if (routine.lastCompleted === dateString) {
            updatedRoutine.streak = routine.streak;
          } else {
            const yesterday = dateUtils.formatDate(
              dateUtils.subDays(dateUtils.parseDate(dateString), 1)
            );
            if (routine.lastCompleted === yesterday) {
              updatedRoutine.streak = routine.streak + 1;
            } else {
              updatedRoutine.streak = 1;
            }
          }
          updatedRoutine.lastCompleted = dateString;
        }
      }
      
      note.routines[routineIndex] = updatedRoutine;
      storageUtils.saveNoteForDate(dateString, note);
      return updatedRoutine;
    }
    return null;
  },

  clearCompletedTodos: async (dateString) => {
    await delay(200);
    const note = await noteService.getNoteForDate(dateString);
    note.todos = note.todos.filter(t => !t.completed);
    note.todos = note.todos.map((todo, index) => ({ ...todo, order: index }));
    storageUtils.saveNoteForDate(dateString, note);
    return note.todos;
  }
};