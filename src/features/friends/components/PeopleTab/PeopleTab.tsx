import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiRefreshCw, FiUsers } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import {
  searchUsers,
  loadFriendStatus,
  sendRequest,
  clearSearch,
} from '../../../friends/store/friendsSlice';
import UserSearchCard from '../UserSearchCard/UserSearchCard';
import './PeopleTab.css';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 400;

const PeopleTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const { searchResults, searchLoading, statuses } = useAppSelector((s) => s.friends);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < MIN_QUERY_LENGTH) {
      dispatch(clearSearch());
      return;
    }

    debounceRef.current = setTimeout(() => {
      dispatch(searchUsers(query.trim()));
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, dispatch]);

  // Load status for each result
  useEffect(() => {
    searchResults.forEach((user) => {
      if (statuses[user.userId] === undefined) {
        dispatch(loadFriendStatus(user.userId));
      }
    });
  }, [searchResults, statuses, dispatch]);

  const handleSendRequest = (userId: number) => {
    dispatch(sendRequest(userId));
  };

  const showHint    = query.trim().length === 0;
  const showTooShort = query.trim().length > 0 && query.trim().length < MIN_QUERY_LENGTH;
  const showEmpty   = !searchLoading && !showHint && !showTooShort && searchResults.length === 0;

  return (
    <div className="people-tab">
      {/* Search input */}
      <div className="people-tab__search-wrap">
        <FiSearch className="people-tab__search-icon" size={17} />
        <input
          type="text"
          className="people-tab__search-input"
          placeholder="Пошук за нікнеймом..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          autoComplete="off"
        />
      </div>

      {/* States */}
      {showHint && (
        <div className="people-tab__hint">
          <FiSearch className="people-tab__hint-icon" />
          <span>Введи нікнейм щоб знайти людей</span>
        </div>
      )}

      {searchLoading && (
        <div className="people-tab__loading">
          <FiRefreshCw className="people-tab__spinner" size={16} />
          Шукаємо...
        </div>
      )}

      {showEmpty && (
        <div className="people-tab__empty">
          <FiUsers className="people-tab__empty-icon" />
          <span>Нікого не знайдено за запитом «{query}»</span>
        </div>
      )}

      {/* Results */}
      {!searchLoading && searchResults.length > 0 && (
        <div className="people-tab__results">
          {searchResults.map((user) => (
            <UserSearchCard
              key={user.userId}
              user={user}
              status={statuses[user.userId] ?? 'none'}
              onSendRequest={handleSendRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PeopleTab;