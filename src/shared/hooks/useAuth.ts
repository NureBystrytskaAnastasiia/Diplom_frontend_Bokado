import { useSelector, useDispatch } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const user  = useAppSelector(s => s.auth.user);
  const token = useAppSelector(s => s.auth.token);
  const isLoading = useAppSelector(s => s.auth.isLoading);
  return { user, token, isLoading, isAuthenticated: !!token };
};