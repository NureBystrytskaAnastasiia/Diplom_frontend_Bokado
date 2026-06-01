import axiosInstance from '../../../shared/api/axiosInstance';
import type { Event, EventDto, UpdateEventDto } from '../types/event';

export const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await axiosInstance.get<Event[]>('/api/Event/events');
  return data;
};

export const createEvent = async (eventDto: EventDto): Promise<Event> => {
  const eventData = {
    ...eventDto,
    createdAt: eventDto.createdAt || new Date().toISOString(),
  };
  const { data } = await axiosInstance.post<Event>('/api/Event/events', eventData);
  return data;
};

export const joinEvent = async (eventId: number): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post<{ message: string }>(
    `/api/Event/events/join/${eventId}`
  );
  return data;
};

export const quitEvent = async (eventId: number): Promise<void> => {
  await axiosInstance.delete(`/api/Event/quit/${eventId}`);
};

export const updateEvent = async (eventId: number, data: UpdateEventDto): Promise<void> => {
  await axiosInstance.put(`/api/Event/${eventId}`, data);
};
