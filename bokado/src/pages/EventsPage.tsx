import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import { loadEvents, joinExistingEvent, quitExistingEvent, initializeUserParticipation } from '../store/slices/eventSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTimes } from 'react-icons/fa';
import '../styles/Events.css';


const EventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading: eventsLoading, error, userParticipation } = useAppSelector(state => state.events);
  const { user } = useAppSelector(state => state.auth);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isProcessing, setIsProcessing] = useState<{ [eventId: number]: boolean }>({});
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const loadEventData = useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      const resultAction = await dispatch(loadEvents());

      if (loadEvents.fulfilled.match(resultAction) && user) {
        dispatch(initializeUserParticipation({ 
          events: resultAction.payload, 
          currentUserId: user.userId 
        }));
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setMessage('Помилка завантаження подій');
      setMessageType('error');
    } finally {
      setIsLoadingEvents(false);
    }
  }, [dispatch, user]);

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  const handleJoin = async (eventId: number) => {
    if (!user) {
      setMessage('Будь ласка, увійдіть, щоб приєднатися до події.');
      setMessageType('error');
      return;
    }

    try {
      setIsProcessing(prev => ({ ...prev, [eventId]: true }));
      await dispatch(joinExistingEvent(eventId)).unwrap();
      setMessage('Ви успішно приєдналися до події!');
      setMessageType('success');

      await loadEventData();
    } catch (err: any) {
      setMessage(err.message || 'Не вдалося приєднатися до події');
      setMessageType('error');
    } finally {
      setIsProcessing(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleQuit = async (eventId: number) => {
    if (!user) return;

    try {
      setIsProcessing(prev => ({ ...prev, [eventId]: true }));
      await dispatch(quitExistingEvent(eventId)).unwrap();
      setMessage('Ви покинули подію.');
      setMessageType('info');
      await loadEventData();
    } catch (err: any) {
      setMessage(err.message || 'Не вдалося покинути подію');
      setMessageType('error');
    } finally {
      setIsProcessing(prev => ({ ...prev, [eventId]: false }));
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="events-container">
      <h1 className="events-title">Події</h1>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
          <button className="close-message" onClick={() => setMessage(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {(isLoadingEvents || eventsLoading) && <div className="loading-state">Завантаження...</div>}
      {error && <div className="error-state">Помилка: {error}</div>}

      <div className="events-list">
        {events.map(ev => {
          const isCreator = user?.userId === ev.creatorId;
          const creatorUsername = ev.creator?.username || `Користувач #${ev.creatorId}`;
          const participantsCount = ev.participants?.length || 0;
          const isFull = participantsCount >= ev.maximum;
          const isJoined = userParticipation[ev.eventId] || false;
          const isLoading = isProcessing[ev.eventId] || false;

          return (
            <div 
              className={`event-card ${isJoined ? 'joined' : ''} ${isCreator ? 'creator' : ''}`} 
              key={ev.eventId}
            >
              {isCreator && (
                <div className="event-badge creator-badge">
                  <FaUser /> Ваша подія
                </div>
              )}

              <div className="event-header">
                <h2 className="event-title">{ev.title}</h2>
                <div className="event-meta">
                  <span className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    {new Date(ev.date).toLocaleDateString('uk-UA')}
                  </span>
                  {ev.city && (
                    <span className="meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      {ev.city}
                    </span>
                  )}
                  <span className="meta-item">Макс: {ev.maximum}</span>
                  <span className="meta-item">Учасники: {participantsCount}</span>
                </div>
              </div>

              {ev.description && (
                <div 
                  className="event-description" 
                  dangerouslySetInnerHTML={{ __html: ev.description }} 
                />
              )}

              <div className="event-footer">
                <div className="event-creator">
                  <FaUser className="creator-icon" />
                  <span>{creatorUsername}</span>
                </div>

                {!isCreator && (
                  <div className="event-actions">
                    {isJoined ? (
                      <button 
                        className="quit-btn" 
                        onClick={() => handleQuit(ev.eventId)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Обробка...' : 'Покинути'}
                      </button>
                    ) : isFull ? (
                      <div className="no-space-message">Місць немає</div>
                    ) : (
                      <button 
                        className="join-btn" 
                        onClick={() => handleJoin(ev.eventId)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Обробка...' : 'Приєднатись'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
