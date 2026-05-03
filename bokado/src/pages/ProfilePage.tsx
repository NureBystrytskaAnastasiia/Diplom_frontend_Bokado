import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAuth';
import { updateProfile, fetchUserProfile, fetchDetailedUserInfo } from '../store/slices/userSlice';
import { fetchAvailableInterests } from '../store/slices/interestsSlice';
import type { UpdateProfileRequest } from '../types/user';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import DashboardNav from '../components/Dashbord/DashboardNav';
import '../styles/ProfilePages.css';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { profile, detailedInfo, isLoading, error: profileError } = useAppSelector((state) => state.user);
  const { availableInterests } = useAppSelector((state) => state.interests);
  
  const [isEditing, setIsEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const userIdNum = userId ? parseInt(userId) : 0;
  const isOwnProfile = currentUser?.userId === userIdNum;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userIdNum || isNaN(userIdNum)) {
        setLoadError("Invalid user ID");
        return;
      }

      try {
        setLoadError(null);
        await dispatch(fetchAvailableInterests()).unwrap();
        await dispatch(fetchUserProfile(userIdNum)).unwrap();
        
        if (isOwnProfile || currentUser?.isAdmin) {
          await dispatch(fetchDetailedUserInfo(userIdNum)).unwrap();
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setLoadError("Failed to load user profile");
      }
    };

    loadProfile();
  }, [userIdNum, dispatch, isOwnProfile, currentUser?.isAdmin]);

  const handleSubmit = async (data: {
    username: string;
    birthDate: string;
    bio: string;
    status: string;
    city: string;
    password: string;
    avatarFile: File | null;
    avatarUrl: string | null;
    interests: string[];
  }) => {
    if (!userIdNum || !profile) return;

    try {
      const updateData: UpdateProfileRequest = {
        username: data.username,
        birthDate: new Date(data.birthDate).toISOString(),
        bio: data.bio || undefined,
        status: data.status || undefined,
        city: data.city || undefined,
        password: data.password || undefined,
        userIcon: data.avatarFile || undefined,
        avatarUrl: data.avatarUrl || null,
        userInterests: data.interests.length > 0 ? data.interests : undefined
      };

      const result = await dispatch(updateProfile({ 
        userId: userIdNum, 
        data: updateData 
      }));
      
      if (updateProfile.fulfilled.match(result)) {
        setIsEditing(false);
        setLocalError(null);
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      setLocalError(err.message || 'Failed to update profile');
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (loadError) return <div className="error">Error: {loadError}</div>;
  if (profileError) return <div className="error">Error: {profileError}</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  return (
    <div className="profile-page-container">
      <DashboardNav username={profile.username} userId={userIdNum} />
      <div className="profile-content">
        {localError && <div className="error-message">{localError}</div>}
        
<div className={`profile-card ${
  profile.isAdmin ? 'admin-profile' : 
  profile.level >= 30 ? 'level-30-plus' : 
  profile.level >= 15 ? 'level-15-30' : 
  profile.level >= 5 ? 'level-5-15' : 'level-1-5'
}`}>
          {!isEditing ? (
            <ProfileView 
              profile={profile}
              detailedInfo={isOwnProfile ? detailedInfo : null}
              isOwnProfile={isOwnProfile}
              onEditClick={() => setIsEditing(true)}
            />
          ) : (
            <ProfileEdit
              profile={profile}
              availableInterests={availableInterests}
              initialFormData={{
                username: profile.username,
                birthDate: profile.birthDate.split('T')[0],
                bio: profile.bio || '',
                status: profile.status || '',
                city: profile.city || '',
                password: ''
              }}
              initialInterests={detailedInfo?.userInterests?.map((i: any) => i.name) || []}
              initialAvatarUrl={profile.avatarUrl || ''}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;