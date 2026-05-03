import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  // Якщо користувач не залогінений, перенаправляємо на сторінку логіну
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Якщо користувач залогінений, показуємо дочірні елементи
  return <>{children}</>;
};

export default ProtectedRoute;
