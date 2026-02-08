// ============================================================================
// FORGOT PASSWORD FORM - Formulario de recuperación de contraseña
// ============================================================================
// Soporta dos flujos: email automático y solicitud a admin
// Basado en resource/webapp/ForgotPasswordPage.tsx

import React, { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Forms/Input';
import { Alert } from '../Feedback/Alert';
import { cn } from '../../lib/utils';

// ============================================================================
// Types
// ============================================================================

export type RecoveryMethod = 'email' | 'admin_request';
export type RecoveryStep = 'input' | 'email_sent' | 'request_sent' | 'error';

export interface ForgotPasswordFormProps {
  /** Método de recuperación: email automático o solicitud a admin */
  recoveryMethod?: RecoveryMethod;
  /** Handler cuando se envía el email */
  onSubmit: (email: string) => void | Promise<void>;
  /** Estado de carga */
  isLoading?: boolean;
  /** Error a mostrar */
  error?: string | null;
  /** Email de soporte (para método admin_request) */
  supportEmail?: string;
  /** Handler para volver al login */
  onBackToLogin?: () => void;
  /** Clases CSS adicionales */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  recoveryMethod = 'email',
  onSubmit,
  isLoading = false,
  error,
  supportEmail = 'soporte@farutech.com',
  onBackToLogin,
  className,
}) => {
  const [email, setEmail] = useState('');
  const [currentStep, setCurrentStep] = useState<RecoveryStep>('input');

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(email);
      
      // Cambiar paso según el método
      if (recoveryMethod === 'email') {
        setCurrentStep('email_sent');
      } else {
        setCurrentStep('request_sent');
      }
    } catch (err) {
      setCurrentStep('error');
    }
  };

  const handleReset = () => {
    setCurrentStep('input');
    setEmail('');
  };

  // ============================================================================
  // Render: Input Step
  // ============================================================================

  if (currentStep === 'input') {
    return (
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30">
            <svg
              className="w-8 h-8 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {recoveryMethod === 'email'
              ? 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'
              : 'Ingresa tu correo electrónico y nuestro equipo te contactará para restablecer tu contraseña.'}
          </p>
        </div>

        {/* Email Input */}
        <Input
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="usuario@empresa.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="email"
          autoFocus
          leftIcon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />

        {/* Admin Request Info */}
        {recoveryMethod === 'admin_request' && (
          <Alert variant="info" title="Solicitud manual">
            Tu solicitud será procesada por nuestro equipo en un plazo de 24 horas. Recibirás
            un correo a {supportEmail} con instrucciones.
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" title="Error">
            {error}
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!email}
        >
          {recoveryMethod === 'email' ? 'Enviar enlace' : 'Enviar solicitud'}
        </Button>

        {/* Back to Login */}
        {onBackToLogin && (
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-sm text-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            ← Volver al inicio de sesión
          </button>
        )}
      </form>
    );
  }

  // ============================================================================
  // Render: Email Sent Success
  // ============================================================================

  if (currentStep === 'email_sent') {
    return (
      <div className={cn('space-y-6 text-center', className)}>
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/30">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            ¡Correo enviado!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor revisa
            tu bandeja de entrada y carpeta de spam.
          </p>
        </div>

        {onBackToLogin && (
          <Button variant="outline" size="lg" fullWidth onClick={onBackToLogin}>
            Volver al inicio de sesión
          </Button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          ¿No recibiste el correo? Intentar de nuevo
        </button>
      </div>
    );
  }

  // ============================================================================
  // Render: Admin Request Sent Success
  // ============================================================================

  if (currentStep === 'request_sent') {
    return (
      <div className={cn('space-y-6 text-center', className)}>
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <svg
            className="w-8 h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Solicitud enviada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tu solicitud ha sido enviada al equipo de soporte. Recibirás un correo en{' '}
            <strong>{email}</strong> con instrucciones en las próximas 24 horas.
          </p>
        </div>

        {onBackToLogin && (
          <Button variant="outline" size="lg" fullWidth onClick={onBackToLogin}>
            Volver al inicio de sesión
          </Button>
        )}
      </div>
    );
  }

  // ============================================================================
  // Render: Error State
  // ============================================================================

  return (
    <div className={cn('space-y-6 text-center', className)}>
      {/* Error Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
        <svg
          className="w-8 h-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Algo salió mal
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || 'No pudimos procesar tu solicitud. Por favor intenta de nuevo.'}
        </p>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={handleReset}>
        Intentar de nuevo
      </Button>

      {onBackToLogin && (
        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-sm text-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          ← Volver al inicio de sesión
        </button>
      )}
    </div>
  );
};

ForgotPasswordForm.displayName = 'ForgotPasswordForm';
