// ============================================================================
// RESET PASSWORD PAGE - Dashboard Auth
// ============================================================================

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout, ResetPasswordForm } from '@farutech/design-system';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const handleSubmit = async (data: { password: string; confirmPassword: string }) => {
    // TODO: Implement reset password API call
    console.log('Reset password request:', { ...data, token });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Navigate to login on success
    navigate('/auth/login');
  };

  return (
    <AuthLayout
      title="Restablecer Contraseña"
      subtitle="Ingresa tu nueva contraseña"
    >
      <ResetPasswordForm
        token={token}
        onSubmit={handleSubmit}
        onBackToLogin={() => navigate('/auth/login')}
      />
    </AuthLayout>
  );
};
