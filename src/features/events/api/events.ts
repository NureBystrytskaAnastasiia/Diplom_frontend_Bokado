import axios from 'axios';
import type { Event, EventDto } from '../types/event';

const API_BASE_URL = 'https://localhost:7192/api/Event';

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  
  return response.data;
};

export const createEvent = async (eventDto: EventDto): Promise<Event> => {
  const token = localStorage.getItem('token');
  const eventData = {
    ...eventDto,
    createdAt: eventDto.createdAt || new Date().toISOString()
  };
  
  const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const joinEvent = async (eventId: number): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE_URL}/events/join/${eventId}`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const quitEvent = async (eventId: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_BASE_URL}/quit/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};