import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEvents, createEvent, joinEvent, quitEvent } from '../../api/events';
import type { Event, EventDto } from '../../types/event';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  userParticipation: { [eventId: number]: boolean };
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
  userParticipation: {}
};

// Thunks
export const loadEvents = createAsyncThunk('events/load', async () => {
  return await fetchEvents();
});

export const createNewEvent = createAsyncThunk(
  'events/create',
  async ({ eventDto }: { eventDto: EventDto }) => {
    return await createEvent(eventDto);
  }
);

export const joinExistingEvent = createAsyncThunk(
  'events/join',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await joinEvent(eventId);
      return { eventId, message: response.message };
    } catch (error: any) {
      const errorData = error.response?.data;

      if (Array.isArray(errorData) && errorData[0]?.description) {
        return rejectWithValue(errorData[0].description);
      }

      return rejectWithValue(error.message || 'Помилка приєднання до події');
    }
  }
);


export const quitExistingEvent = createAsyncThunk(
  'events/quit',
  async (eventId: number, { rejectWithValue }) => {
    try {
      await quitEvent(eventId);
      return { eventId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Помилка виходу з події');
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    initializeUserParticipation: (state, action) => {
      const { events, currentUserId } = action.payload;
      const participation: { [eventId: number]: boolean } = {};

      events.forEach((event: Event) => {
        const isParticipant = event.participants?.some(p => p.userId === currentUserId);
        participation[event.eventId] = isParticipant || event.creatorId === currentUserId;
      });

      state.userParticipation = participation;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load Events
      .addCase(loadEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load events';
      })

      // Create Event
      .addCase(createNewEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createNewEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create event';
      })

      // Join Event
      .addCase(joinExistingEvent.pending, (state) => {
        state.error = null;
      })
      .addCase(joinExistingEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        state.userParticipation[eventId] = true;

        const event = state.events.find(e => e.eventId === eventId);
        if (event) {
          const currentUserId = Number(localStorage.getItem('userId'));
          if (event.participants && !event.participants.some(p => p.userId === currentUserId)) {
            // Створюємо мінімальний об'єкт учасника з необхідними полями
            const newParticipant = {
              eventParticipantId: Date.now(),  // тимчасовий ID або 0, якщо буде замінений сервером
              eventId: eventId,
              userId: currentUserId,
              joinedAt: new Date().toISOString(), // дата приєднання у форматі ISO
            };
            event.participants.push(newParticipant);
          }
        }

        state.error = null;
      })
      .addCase(joinExistingEvent.rejected, (state, action) => {
        const errMsg = action.payload as string;

        // Логуємо помилку для відладки
        console.error('Join event error:', errMsg);

        if (errMsg.includes('Ви вже приєднані до цієї події')) {
          // Користувач вже приєднаний - оновлюємо стан і прибираємо помилку
          const eventId = action.meta.arg as number;
          state.userParticipation[eventId] = true;
          state.error = null;
        } else {
          state.error = errMsg;
        }
      })

      // Quit Event
      .addCase(quitExistingEvent.pending, (state) => {
        state.error = null;
      })
      .addCase(quitExistingEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        state.userParticipation[eventId] = false;

        const event = state.events.find(e => e.eventId === eventId);
        if (event && event.participants) {
          const currentUserId = Number(localStorage.getItem('userId'));
          event.participants = event.participants.filter(p => p.userId !== currentUserId);
        }

        state.error = null;
      })
      .addCase(quitExistingEvent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { initializeUserParticipation } = eventSlice.actions;
export default eventSlice.reducer;
