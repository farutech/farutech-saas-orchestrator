// ============================================================================
// REGISTER PAGE - Dashboard Auth
// ============================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, RegisterForm } from '@farutech/design-system';
import { useAuthStore } from '../../store/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuthStore();

  const handleRegister = async (data: { email: string; password: string }) => {
    try {
      await register({
        email: data.email,
        password: data.password,
      });
      // After successful registration, navigate to login
      navigate('/auth/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Regístrate en Farutech"
    >
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isRegistering}
        onBackToLogin={() => navigate('/auth/login')}
      />
    </AuthLayout>
  );
};
