// ============================================================================
// FORGOT PASSWORD PAGE - Dashboard Auth
// ============================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, ForgotPasswordForm } from '@farutech/design-system';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (email: string) => {
    // TODO: Implement forgot password API call
    console.log('Forgot password request:', email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Te ayudaremos a recuperar el acceso a tu cuenta"
    >
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        onBackToLogin={() => navigate('/auth/login')}
      />
    </AuthLayout>
  );
};
