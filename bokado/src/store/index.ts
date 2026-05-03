import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import friendsReducer from './slices/friendsSlice';
import chatReducer from './slices/chatSlice';
import eventsReducer from './slices/eventSlice';
import challengesReducer from './slices/challengeSlice';
import userChallengesReducer from './slices/usechallengesSlice';
import interestsReducer from './slices/interestsSlice'; 


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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;