export { fetchUserProfile, fetchDetailedUserInfo, updateProfile, clearError, clearUserData } from './store/userSlice';
export { fetchAvailableInterests } from './store/interestsSlice';
export * from './api/user';
export type { UserProfile, UserDetailInfo, UpdateProfileRequest, Interest } from './types/user';
export { default as ProfilePage } from './pages/ProfilePage';