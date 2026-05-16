import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEvents, createEvent, joinEvent, quitEvent, updateEvent } from '../api/events';
import type { Event, EventDto, UpdateEventDto } from '../types/event';

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
  userParticipation: {},
};

// ── Thunks ──
export const loadEvents = createAsyncThunk('events/load', async () => {
  return await fetchEvents();
});

export const createNewEvent = createAsyncThunk(
  'events/create',
  async ({ eventDto }: { eventDto: EventDto }, { rejectWithValue }) => {
    try {
      return await createEvent(eventDto);
    } catch (e: any) {
      const errorData = e.response?.data;
      const msg = typeof errorData === 'string'
        ? errorData
        : errorData?.title || e.message || 'Помилка створення події';
      return rejectWithValue(msg);
    }
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

export const updateExistingEvent = createAsyncThunk(
  'events/update',
  async ({ eventId, data }: { eventId: number; data: UpdateEventDto }, { rejectWithValue }) => {
    try {
      await updateEvent(eventId, data);
      return { eventId, data };
    } catch (error: any) {
      const errorData = error.response?.data;
      if (Array.isArray(errorData) && errorData[0]?.description) {
        return rejectWithValue(errorData[0].description);
      }
      return rejectWithValue(error.message || 'Помилка оновлення події');
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
    },
    clearEventError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadEvents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadEvents.fulfilled, (state, action) => { state.loading = false; state.events = action.payload; })
      .addCase(loadEvents.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Помилка'; })

      // create
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
        state.error = null;
      })
      .addCase(createNewEvent.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // join
      .addCase(joinExistingEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        state.userParticipation[eventId] = true;
        const event = state.events.find(e => e.eventId === eventId);
        if (event) {
          const currentUserId = Number(localStorage.getItem('userId'));
          if (event.participants && !event.participants.some(p => p.userId === currentUserId)) {
            event.participants.push({
              eventParticipantId: Date.now(),
              eventId,
              userId: currentUserId,
              joinedAt: new Date().toISOString(),
            });
          }
        }
        state.error = null;
      })
      .addCase(joinExistingEvent.rejected, (state, action) => {
        const errMsg = action.payload as string;
        if (errMsg && errMsg.includes('вже')) {
          const eventId = action.meta.arg as number;
          state.userParticipation[eventId] = true;
          state.error = null;
        } else {
          state.error = errMsg;
        }
      })

      // quit
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
      })

      // update
      .addCase(updateExistingEvent.fulfilled, (state, action) => {
        const { eventId, data } = action.payload;
        const event = state.events.find(e => e.eventId === eventId);
        if (event) {
          if (data.title       !== undefined) event.title       = data.title!;
          if (data.description !== undefined) event.description = data.description;
          if (data.date        !== undefined) event.date        = data.date!;
          if (data.city        !== undefined) event.city        = data.city;
        }
        state.error = null;
      })
      .addCase(updateExistingEvent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { initializeUserParticipation, clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
