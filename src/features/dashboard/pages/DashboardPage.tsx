import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { loadEvents, joinExistingEvent, quitExistingEvent, initializeUserParticipation } from '../../events/store/eventSlice';
import { fetchChallenges, completeChallenge } from '../../challenges/store/usechallengesSlice';
import { loadRecommendations, joinGroupById } from '../../groups/store/groupsSlice';
import { useCats } from '../../../hooks/useCat';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import WeatherWidget from '../components/WeatherWidget/Weatherwidget';
import NearbyUsersMap from '../components/Nearbyusersmap/Nearbyusersmap';

import DashboardHero       from '../components/DashboardHero';
import EventsCard          from '../components/EventsCard';
import ChallengesCard      from '../components/ChallengesCard';
import GroupsCard          from '../components/GroupsCard';
import CatsCard            from '../components/CatsCard';
import ParticlesBackground from '../components/ParticlesBackground';

import '../styles/Dashboard.css';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((s) => s.auth);
  const { events, userParticipation, loading: eventsLoading }   = useAppSelector((s) => s.events);
  const { challenges, loading: challsLoading }                   = useAppSelector((s) => s.userChallenges);
  const { recommendations, actionLoading, loading: groupsLoading } = useAppSelector((s) => s.groups);
  const { cats, loading: catsLoading, refetch: refetchCats }     = useCats(3);

  useEffect(() => {
    dispatch(loadEvents());
    if (token) dispatch(fetchChallenges(token));
    dispatch(loadRecommendations());
  }, [dispatch, token]);

  useEffect(() => {
    if (events.length && user) {
      dispatch(initializeUserParticipation({ events, currentUserId: user.userId }));
    }
  }, [events, user, dispatch]);

  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const activeChalls = challenges.filter(c => !c.isCompleted).slice(0, 3);
  const doneChalls   = challenges.filter(c =>  c.isCompleted).length;
  const recGroups    = recommendations.slice(0, 3);

  const handleJoinEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    userParticipation[eventId]
      ? dispatch(quitExistingEvent(eventId))
      : dispatch(joinExistingEvent(eventId));
  };

  const handleCompleteChallenge = (e: React.MouseEvent, challengeId: number) => {
    e.stopPropagation();
    if (token) dispatch(completeChallenge({ challengeId, token }));
  };

  const handleJoinGroup = (e: React.MouseEvent, groupId: number) => {
    e.stopPropagation();
    dispatch(joinGroupById(groupId));
  };

  return (
    <AppLayout>
      <ParticlesBackground />
      <div className="db" style={{ position: 'relative', zIndex: 1 }}>

        <DashboardHero
          user={user}
          eventsCount={events.length}
          doneChalls={doneChalls}
          challsCount={challenges.length}
        />

        <div className="db__grid">
          <EventsCard
            events={upcomingEvents}
            userParticipation={userParticipation}
            loading={eventsLoading}
            onJoin={handleJoinEvent}
          />
          <ChallengesCard
            challenges={challenges}
            activeChalls={activeChalls}
            doneChalls={doneChalls}
            loading={challsLoading}
            onComplete={handleCompleteChallenge}
          />
          <GroupsCard
            groups={recGroups}
            currentUserId={user?.userId}
            actionLoading={actionLoading}
            loading={groupsLoading}
            onJoin={handleJoinGroup}
          />
        </div>
        <WeatherWidget />
        <CatsCard
          cats={cats}
          loading={catsLoading}
          onRefetch={refetchCats}
        />
        <NearbyUsersMap />

      </div>
    </AppLayout>
  );
};

export default DashboardPage;