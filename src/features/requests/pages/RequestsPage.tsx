import React, { useEffect } from 'react';
import { FiRefreshCw, FiBell } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import {
  loadIncomingRequests,
  acceptRequest,
  declineRequest,
} from '../../friends/store/friendsSlice';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import FriendRequestCard from '../components/FriendRequestCard/FriendRequestCard';
import '../styles/Requests.css';

const RequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { incomingRequests, requestsLoading } = useAppSelector((s) => s.friends);

  useEffect(() => {
    dispatch(loadIncomingRequests());
  }, [dispatch]);

  const handleAccept  = (userId: number) => dispatch(acceptRequest(userId));
  const handleDecline = (userId: number) => dispatch(declineRequest(userId));

  return (
    <AppLayout>
      <div className="requests">
        <header className="requests__header">
          <h1 className="requests__title">Запити</h1>
          <p className="requests__subtitle">Люди які хочуть додати тебе в друзі</p>
        </header>

        <section>
          <div className="requests__section-title">
            <FiBell size={17} />
            Вхідні запити
            {incomingRequests.length > 0 && (
              <span className="requests__count">{incomingRequests.length}</span>
            )}
          </div>

          {requestsLoading && (
            <div className="requests__loading">
              <FiRefreshCw className="requests__spinner" size={16} />
              Завантаження...
            </div>
          )}

          {!requestsLoading && incomingRequests.length === 0 && (
            <div className="requests__empty">
              <FiBell className="requests__empty-icon" />
              <span>Немає вхідних запитів</span>
            </div>
          )}

          {!requestsLoading && incomingRequests.length > 0 && (
            <div className="requests__list">
              {incomingRequests.map((req) => (
                <FriendRequestCard
                  key={req.friendRequestId}
                  request={req}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default RequestsPage;