import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Імпортуємо сторінки
import LoginPage from './features/auth/pages/Login/LoginPage';
import RegisterPage from './features/auth/pages/Registration/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import AdminPage from './features/admin/pages/AdminPage';
import FriendsDashboardPage from './features/friends/pages/FriendsDashboardPage';
import EventsPage from './features/events/pages/EventsPage';
import CreateEventPage from './features/events/pages/CreateEventPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPassword/ForgotPasswordPage';
import ChatsPage from './features/chat/pages/ChatPage';
import ChatRoomPage from './features/chat/pages/ChatWithUserPage';
import ChallengesPage from './features/challenges/pages/ChallengesPage';
import PremiumOffer from './features/premium/pages/PremiumOffer';
import LandingPage from './features/lading/pages/LandingPage';
import AboutHero from './features/about/components/AboutHero/AboutHero';


// Імпортуємо захищені маршрути
import ProtectedRoute from './routes/ProtectedRoute';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* 🔓 Публічні маршрути */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<AboutHero />} />
          <Route path="/" element={<LandingPage />} />
          
          {/* Події можуть бути публічними або захищеними - залежно від вашої логіки */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />

          {/* 🔒 Приватні маршрути */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/friends-dashboard" element={<ProtectedRoute><FriendsDashboardPage /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><ChatsPage /></ProtectedRoute>} />
          <Route path="/chat/:chatId" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
          <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><PremiumOffer /></ProtectedRoute>} />


          {/* 🔒 Адмін-маршрути */}
          <Route path="/admin" element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>} />

          {/* 🔀 Редиректи */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Обробка неіснуючих маршрутів */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;