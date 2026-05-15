import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AnimatePresence } from 'framer-motion';

// Сторінки
import LoginPage          from './features/auth/pages/Login/LoginPage';
import RegisterPage       from './features/auth/pages/Registration/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPassword/ForgotPasswordPage';
import LandingPage        from './features/lading/pages/LandingPage';
import AboutPage          from './features/about/pages/AboutPage';
import CookiesPage        from './features/legal/pages/CookiesPage';
import RulesPage          from './features/legal/pages/RulesPage';
import PrivacyPage        from './features/legal/pages/PrivacyPage';
import EventsPage         from './features/events/pages/EventsPage';
import CreateEventPage    from './features/events/pages/CreateEventPage';
import DashboardPage      from './features/dashboard/pages/DashboardPage';
import ProfilePage        from './features/profile/pages/ProfilePage';
import ChatsPage          from './features/chat/pages/ChatPage';
import ChatRoomPage       from './features/chat/pages/ChatWithUserPage';
import ChallengesPage     from './features/challenges/pages/ChallengesPage';
import PremiumOffer       from './features/premium/pages/PremiumOffer';
import AdminPage          from './features/admin/pages/AdminPage';
import NotFoundPage       from './features/legal/pages/NotFoundPage';
import DiscoverPage        from './features/friends/pages/DiscoverPage';
import RequestsPage        from './features/requests/pages/RequestsPage';
import GroupPage           from './features/groups/pages/GroupPage';
// Утиліти
import ProtectedRoute      from './routes/ProtectedRoute';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import ScrollToTop         from './shared/components/ScrollToTop';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Публічні */}
        <Route path="/"                element={<LandingPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about"           element={<AboutPage />} />
        <Route path="/cookies"         element={<CookiesPage />} />
        <Route path="/rules"           element={<RulesPage />} />
        <Route path="/privacy"         element={<PrivacyPage />} />
        <Route path="/events"          element={<EventsPage />} />

        {/* Захищені */}
        <Route path="/events/create" element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/chats" element={
          <ProtectedRoute>
            <ChatsPage />
          </ProtectedRoute>
        } />
        <Route path="/chat/:chatId" element={
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        } />
        <Route path="/challenges" element={
          <ProtectedRoute>
            <ChallengesPage />
          </ProtectedRoute>
        } />
        <Route path="/discover" element={
          <ProtectedRoute>
            <DiscoverPage />
          </ProtectedRoute>
        } />
        <Route path="/requests" element={
          <ProtectedRoute>
            <RequestsPage />
          </ProtectedRoute>
        } />
          <Route path="/groups/:groupId" element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        } />
        <Route path="/premium" element={
          <ProtectedRoute>
            <PremiumOffer />
          </ProtectedRoute>
        } />

        {/* Адмін */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  </Provider>
);

export default App;