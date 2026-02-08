// ============================================================================
// LOGIN PAGE - Dashboard Auth
// ============================================================================
// Página de login usando Design System Auth components

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, LoginForm } from '@farutech/design-system';
import { useAuthStore } from '../../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn, requiresContextSelection } = useAuthStore();

  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    try {
      await login({ email: data.email, password: data.password });
      
      // Check if context selection is required
      const state = useAuthStore.getState();
      if (state.requiresContextSelection) {
        navigate('/auth/select-context');
      } else {
        navigate('/launcher');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Accede a tu cuenta de Farutech"
    >
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoggingIn}
        onForgotPassword={() => navigate('/auth/forgot-password')}
      />
    </AuthLayout>
  );
};
