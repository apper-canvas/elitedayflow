import { toast } from "react-toastify";
import { dateUtils } from "@/utils/dateUtils";

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
});

export const noteService = {
  getNoteForDate: async (dateString) => {
    try {
      const noteResponse = await apperClient.fetchRecords("note_c", {
        fields: [{ field: { Name: "Id" } }, { field: { Name: "Name" } }, { field: { Name: "date_c" } }],
        where: [{ FieldName: "date_c", Operator: "EqualTo", Values: [dateString] }],
        pagingInfo: { limit: 1, offset: 0 },
      });

      if (!noteResponse.success) {
        console.error(noteResponse.message);
        toast.error(noteResponse.message);
        throw new Error(noteResponse.message);
      }

      let noteId;
      if (!noteResponse.data || noteResponse.data.length === 0) {
        const createResponse = await apperClient.createRecord("note_c", {
          records: [{ Name: `Note for ${dateString}`, date_c: dateString }],
        });

        if (!createResponse.success) {
          console.error(createResponse.message);
          toast.error(createResponse.message);
          throw new Error(createResponse.message);
        }

        noteId = createResponse.results[0].data.Id;
      } else {
        noteId = noteResponse.data[0].Id;
      }

      const [meetingsResponse, todosResponse, routinesResponse] = await Promise.all([
        apperClient.fetchRecords("meeting_c", {
          fields: [
            { field: { Name: "Id" } },
            { field: { Name: "time_c" } },
            { field: { Name: "title_c" } },
            { field: { Name: "description_c" } },
            { field: { Name: "status_c" } },
            { field: { Name: "created_at_c" } },
          ],
          where: [{ FieldName: "note_id_c", Operator: "EqualTo", Values: [noteId] }],
          orderBy: [{ fieldName: "time_c", sorttype: "ASC" }],
        }),
        apperClient.fetchRecords("todo_c", {
          fields: [
            { field: { Name: "Id" } },
            { field: { Name: "text_c" } },
            { field: { Name: "completed_c" } },
            { field: { Name: "priority_c" } },
            { field: { Name: "order_c" } },
            { field: { Name: "created_at_c" } },
          ],
          where: [{ FieldName: "note_id_c", Operator: "EqualTo", Values: [noteId] }],
          orderBy: [{ fieldName: "order_c", sorttype: "ASC" }],
        }),
        apperClient.fetchRecords("routine_c", {
          fields: [
            { field: { Name: "Id" } },
            { field: { Name: "title_c" } },
            { field: { Name: "completed_c" } },
            { field: { Name: "streak_c" } },
            { field: { Name: "last_completed_c" } },
          ],
          where: [{ FieldName: "note_id_c", Operator: "EqualTo", Values: [noteId] }],
        }),
      ]);

      if (!meetingsResponse.success) {
        console.error(meetingsResponse.message);
        toast.error(meetingsResponse.message);
      }

      if (!todosResponse.success) {
        console.error(todosResponse.message);
        toast.error(todosResponse.message);
      }

      if (!routinesResponse.success) {
        console.error(routinesResponse.message);
        toast.error(routinesResponse.message);
      }

      return {
        date: dateString,
        noteId,
        meetings: (meetingsResponse.data || []).map((m) => ({
          id: m.Id,
          time_c: m.time_c || "",
          title_c: m.title_c || "",
          description_c: m.description_c || "",
          status_c: m.status_c || "upcoming",
          created_at_c: m.created_at_c,
        })),
        todos: (todosResponse.data || []).map((t) => ({
          id: t.Id,
          text_c: t.text_c || "",
          completed_c: t.completed_c || false,
          priority_c: t.priority_c || "medium",
          order_c: t.order_c || 0,
          created_at_c: t.created_at_c,
        })),
        routines: (routinesResponse.data || []).map((r) => ({
          id: r.Id,
          title_c: r.title_c || "",
          completed_c: r.completed_c || false,
          streak_c: r.streak_c || 0,
          last_completed_c: r.last_completed_c || null,
        })),
      };
    } catch (error) {
      console.error("Error fetching note:", error.message || error);
      throw error;
    }
  },

  addMeeting: async (dateString, meeting) => {
    try {
      const note = await noteService.getNoteForDate(dateString);

      const createResponse = await apperClient.createRecord("meeting_c", {
        records: [
          {
            Name: meeting.title_c || "Untitled Meeting",
            time_c: meeting.time_c,
            title_c: meeting.title_c,
            description_c: meeting.description_c || "",
            status_c: "upcoming",
            created_at_c: new Date().toISOString(),
            note_id_c: note.noteId,
          },
        ],
      });

      if (!createResponse.success) {
        console.error(createResponse.message);
        toast.error(createResponse.message);
        throw new Error(createResponse.message);
      }

      if (createResponse.results) {
        const failed = createResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create meeting:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create meeting");
        }
      }

      return createResponse.results[0].data;
    } catch (error) {
      console.error("Error adding meeting:", error.message || error);
      throw error;
    }
  },

  updateMeeting: async (dateString, meetingId, updates) => {
    try {
      const updateData = {
        Id: meetingId,
      };

      if (updates.time_c !== undefined) updateData.time_c = updates.time_c;
      if (updates.title_c !== undefined) {
        updateData.title_c = updates.title_c;
        updateData.Name = updates.title_c;
      }
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
      if (updates.status_c !== undefined) updateData.status_c = updates.status_c;

      const updateResponse = await apperClient.updateRecord("meeting_c", {
        records: [updateData],
      });

      if (!updateResponse.success) {
        console.error(updateResponse.message);
        toast.error(updateResponse.message);
        throw new Error(updateResponse.message);
      }

      if (updateResponse.results) {
        const failed = updateResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update meeting:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update meeting");
        }
      }

      return updateResponse.results[0].data;
    } catch (error) {
      console.error("Error updating meeting:", error.message || error);
      throw error;
    }
  },

  deleteMeeting: async (dateString, meetingId) => {
    try {
      const deleteResponse = await apperClient.deleteRecord("meeting_c", {
        RecordIds: [meetingId],
      });

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        throw new Error(deleteResponse.message);
      }

      if (deleteResponse.results) {
        const failed = deleteResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete meeting:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete meeting");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting meeting:", error.message || error);
      throw error;
    }
  },

  addTodo: async (dateString, todo) => {
    try {
      const note = await noteService.getNoteForDate(dateString);

      const createResponse = await apperClient.createRecord("todo_c", {
        records: [
          {
            Name: todo.text_c || "Untitled Todo",
            text_c: todo.text_c,
            completed_c: false,
            priority_c: todo.priority_c || "medium",
            order_c: note.todos.length,
            created_at_c: new Date().toISOString(),
            note_id_c: note.noteId,
          },
        ],
      });

      if (!createResponse.success) {
        console.error(createResponse.message);
        toast.error(createResponse.message);
        throw new Error(createResponse.message);
      }

      if (createResponse.results) {
        const failed = createResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create todo:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create todo");
        }
      }

      return createResponse.results[0].data;
    } catch (error) {
      console.error("Error adding todo:", error.message || error);
      throw error;
    }
  },

  updateTodo: async (dateString, todoId, updates) => {
    try {
      const updateData = {
        Id: todoId,
      };

      if (updates.text_c !== undefined) {
        updateData.text_c = updates.text_c;
        updateData.Name = updates.text_c;
      }
      if (updates.completed_c !== undefined) updateData.completed_c = updates.completed_c;
      if (updates.priority_c !== undefined) updateData.priority_c = updates.priority_c;
      if (updates.order_c !== undefined) updateData.order_c = updates.order_c;

      const updateResponse = await apperClient.updateRecord("todo_c", {
        records: [updateData],
      });

      if (!updateResponse.success) {
        console.error(updateResponse.message);
        toast.error(updateResponse.message);
        throw new Error(updateResponse.message);
      }

      if (updateResponse.results) {
        const failed = updateResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update todo:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update todo");
        }
      }

      return updateResponse.results[0].data;
    } catch (error) {
      console.error("Error updating todo:", error.message || error);
      throw error;
    }
  },

  deleteTodo: async (dateString, todoId) => {
    try {
      const deleteResponse = await apperClient.deleteRecord("todo_c", {
        RecordIds: [todoId],
      });

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        throw new Error(deleteResponse.message);
      }

      if (deleteResponse.results) {
        const failed = deleteResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete todo:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete todo");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting todo:", error.message || error);
      throw error;
    }
  },

  reorderTodos: async (dateString, todos) => {
    try {
      const updateRecords = todos.map((todo, index) => ({
        Id: todo.id,
        order_c: index,
      }));

      const updateResponse = await apperClient.updateRecord("todo_c", {
        records: updateRecords,
      });

      if (!updateResponse.success) {
        console.error(updateResponse.message);
        toast.error(updateResponse.message);
        throw new Error(updateResponse.message);
      }

      if (updateResponse.results) {
        const failed = updateResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to reorder ${failed.length} todos:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
        }
      }

      return todos;
    } catch (error) {
      console.error("Error reordering todos:", error.message || error);
      throw error;
    }
  },

  updateRoutine: async (dateString, routineId, updates) => {
    try {
      const updateData = {
        Id: routineId,
      };

      if (updates.completed_c !== undefined) {
        updateData.completed_c = updates.completed_c;

        if (updates.completed_c) {
          const routineResponse = await apperClient.getRecordById("routine_c", routineId, {
            fields: [
              { field: { Name: "Id" } },
              { field: { Name: "streak_c" } },
              { field: { Name: "last_completed_c" } },
            ],
          });

          if (routineResponse.success && routineResponse.data) {
            const routine = routineResponse.data;
            if (routine.last_completed_c === dateString) {
              updateData.streak_c = routine.streak_c;
            } else {
              const yesterday = dateUtils.formatDate(dateUtils.subDays(dateUtils.parseDate(dateString), 1));
              if (routine.last_completed_c === yesterday) {
                updateData.streak_c = (routine.streak_c || 0) + 1;
              } else {
                updateData.streak_c = 1;
              }
            }
            updateData.last_completed_c = dateString;
          } else {
            updateData.streak_c = 1;
            updateData.last_completed_c = dateString;
          }
        }
      }

      const updateResponse = await apperClient.updateRecord("routine_c", {
        records: [updateData],
      });

      if (!updateResponse.success) {
        console.error(updateResponse.message);
        toast.error(updateResponse.message);
        throw new Error(updateResponse.message);
      }

      if (updateResponse.results) {
        const failed = updateResponse.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update routine:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update routine");
        }
      }

      return updateResponse.results[0].data;
    } catch (error) {
      console.error("Error updating routine:", error.message || error);
      throw error;
    }
  },

  clearCompletedTodos: async (dateString) => {
    try {
      const note = await noteService.getNoteForDate(dateString);
      const completedTodos = note.todos.filter((t) => t.completed_c);

      if (completedTodos.length > 0) {
        const deleteResponse = await apperClient.deleteRecord("todo_c", {
          RecordIds: completedTodos.map((t) => t.id),
        });

        if (!deleteResponse.success) {
          console.error(deleteResponse.message);
          toast.error(deleteResponse.message);
          throw new Error(deleteResponse.message);
        }

        if (deleteResponse.results) {
          const failed = deleteResponse.results.filter((r) => !r.success);
          if (failed.length > 0) {
            console.error(`Failed to delete ${failed.length} completed todos:`, failed);
            failed.forEach((record) => {
              if (record.message) toast.error(record.message);
            });
          }
        }
      }

      const remainingTodos = note.todos.filter((t) => !t.completed_c);
      if (remainingTodos.length > 0) {
        await noteService.reorderTodos(dateString, remainingTodos);
      }

      return remainingTodos;
    } catch (error) {
      console.error("Error clearing completed todos:", error.message || error);
      throw error;
    }
  },
};