// src/features/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { signup, login, logout, clearError } from '../store/authSlice';
import { LoginPayload, SignupPayload } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector((s) => s.auth);

  const handleSignup = useCallback(
    (payload: SignupPayload) => dispatch(signup(payload)),
    [dispatch]
  );

  const handleLogin = useCallback(
    (payload: LoginPayload) => dispatch(login(payload)),
    [dispatch]
  );

  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);

  const handleClearError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
