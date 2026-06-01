import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AnimatePresence } from 'framer-motion';

// Features
import { LoginPage, RegisterPage, ForgotPasswordPage } from './features/auth';
import { LandingPage }                                 from './features/lading';
import { CookiesPage, RulesPage, PrivacyPage, NotFoundPage } from './features/legal';
import { EventsPage, CreateEventPage }                 from './features/events';
import { DashboardPage }                               from './features/dashboard';
import { ProfilePage }                                 from './features/profile';
import { ChatPage as ChatsPage, ChatWithUserPage as ChatRoomPage } from './features/chat';
import { ChallengesPage }                              from './features/challenges';
import { PremiumOffer }                                from './features/premium';
import { AdminPage }                                   from './features/admin';
import { DiscoverPage }                                from './features/friends';
import { RequestsPage }                                from './features/requests';
import { GroupPage }                                   from './features/groups';
import { useNotificationHub }                          from './features/notifications';
import { AboutPage } from './features/about';

// Утиліти
import ProtectedRoute      from './routes/ProtectedRoute';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import ScrollToTop         from './shared/components/ScrollToTop';
import { useChatHubGlobal } from './features/chat/hooks/useChatHub';
import { useAppSelector }   from './shared/hooks/useAuth';

const AnimatedRoutes = () => {
  const location = useLocation();
  const token    = useAppSelector(s => s.auth.token);

  useNotificationHub();
  useChatHubGlobal(token ?? null);

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
        <Route path="/events/create"   element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
        <Route path="/dashboard"       element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/chats"           element={<ProtectedRoute><ChatsPage /></ProtectedRoute>} />
        <Route path="/chat/:chatId"    element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
        <Route path="/challenges"      element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
        <Route path="/discover"        element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
        <Route path="/requests"        element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
        <Route path="/groups/:groupId" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
        <Route path="/premium"         element={<ProtectedRoute><PremiumOffer /></ProtectedRoute>} />

        {/* Адмін */}
        <Route path="/admin" element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>} />

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