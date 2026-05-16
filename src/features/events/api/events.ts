import axios from 'axios';
import type { Event, EventDto, UpdateEventDto } from '../types/event';

const API_BASE_URL = 'https://localhost:7192/api/Event';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  return response.data;
};

export const createEvent = async (eventDto: EventDto): Promise<Event> => {
  const eventData = {
    ...eventDto,
    createdAt: eventDto.createdAt || new Date().toISOString(),
  };
  const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
    headers: authHeaders(),
  });
  return response.data;
};

export const joinEvent = async (eventId: number): Promise<{ message: string }> => {
  const response = await axios.post(`${API_BASE_URL}/events/join/${eventId}`, null, {
    headers: authHeaders(),
  });
  return response.data;
};

export const quitEvent = async (eventId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/quit/${eventId}`, {
    headers: authHeaders(),
  });
};

// PUT /api/Event/{eventId} — тільки для creator/admin
export const updateEvent = async (
  eventId: number,
  data: UpdateEventDto
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${eventId}`, data, {
    headers: authHeaders(),
  });
};
