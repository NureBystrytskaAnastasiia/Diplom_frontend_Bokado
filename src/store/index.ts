import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import userReducer from '../features/profile/store/userSlice';
import adminReducer from '../features/admin/store/adminSlice';
import friendsReducer from '../features/friends/store/friendsSlice';
import chatReducer from '../features/chat/store/chatSlice';
import eventsReducer from '../features/events/store/eventSlice';
import challengesReducer from '../features/challenges/store/challengeSlice';
import userChallengesReducer from '../features/challenges/store/usechallengesSlice';
import interestsReducer from '../features/profile/store/interestsSlice'; 
import groupsReducer from '../features/groups/store/groupsSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
     user: userReducer,
      admin: adminReducer,
      friends: friendsReducer,
      chat: chatReducer,
      events: eventsReducer,
      challenges: challengesReducer,
      userChallenges: userChallengesReducer,
      interests: interestsReducer,
      groups: groupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;