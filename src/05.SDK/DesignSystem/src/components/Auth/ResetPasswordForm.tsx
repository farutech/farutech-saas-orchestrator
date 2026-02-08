// ============================================================================
// RESET PASSWORD FORM - Formulario para restablecer contraseña
// ============================================================================
// Componente NUEVO (no existe en resource/webapp)
// Incluye validación de fortaleza y confirmación

import React, { useState, useMemo } from 'react';
import { Button } from '../Button';
import { Input } from '../Forms/Input';
import { Alert } from '../Feedback/Alert';
import { cn } from '../../lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormProps {
  /** Token de recuperación (desde URL) */
  token?: string;
  /** Handler cuando se envía el formulario */
  onSubmit: (data: ResetPasswordFormData) => void | Promise<void>;
  /** Estado de carga */
  isLoading?: boolean;
  /** Error a mostrar */
  error?: string | null;
  /** Handler para volver al login */
  onBackToLogin?: () => void;
  /** Requerimientos mínimos de contraseña */
  passwordRequirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
  /** Clases CSS adicionales */
  className?: string;
}

// ============================================================================
// Password Strength Calculation
// ============================================================================

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
  
  return Math.min(strength, 100);
};

const getStrengthColor = (strength: number): string => {
  if (strength < 40) return 'bg-red-500';
  if (strength < 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getStrengthLabel = (strength: number): string => {
  if (strength < 40) return 'Débil';
  if (strength < 70) return 'Media';
  return 'Fuerte';
};

// ============================================================================
// Component
// ============================================================================

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token: _token,
  onSubmit,
  isLoading = false,
  error,
  onBackToLogin,
  passwordRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  className,
}) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // ============================================================================
  // Password Validation
  // ============================================================================

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.password),
    [formData.password]
  );

  const passwordValidation = useMemo(() => {
    const { password } = formData;
    const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } =
      passwordRequirements;

    return {
      minLength: !minLength || password.length >= minLength,
      hasUppercase: !requireUppercase || /[A-Z]/.test(password),
      hasLowercase: !requireLowercase || /[a-z]/.test(password),
      hasNumbers: !requireNumbers || /[0-9]/.test(password),
      hasSpecialChars: !requireSpecialChars || /[^a-zA-Z0-9]/.test(password),
    };
  }, [formData.password, passwordRequirements]);

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const canSubmit = isPasswordValid && passwordsMatch && formData.password.length > 0;

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    try {
      await onSubmit(formData);
      setSuccess(true);
    } catch (err) {
      // Error handled by parent
    }
  };

  const handleChange = (field: keyof ResetPasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // ============================================================================
  // Render: Success State
  // ============================================================================

  if (success) {
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
            ¡Contraseña actualizada!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva
            contraseña.
          </p>
        </div>

        {onBackToLogin && (
          <Button variant="primary" size="lg" fullWidth onClick={onBackToLogin}>
            Ir al inicio de sesión
          </Button>
        )}
      </div>
    );
  }

  // ============================================================================
  // Render: Form
  // ============================================================================

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
          Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
        </p>
      </div>

      {/* New Password Input */}
      <div>
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Nueva contraseña"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange('password')}
          disabled={isLoading}
          required
          autoComplete="new-password"
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          }
        />

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Fortaleza de la contraseña
              </span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {getStrengthLabel(passwordStrength)}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  getStrengthColor(passwordStrength)
                )}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Input */}
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        label="Confirmar contraseña"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        disabled={isLoading}
        required
        autoComplete="new-password"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        rightIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        }
        error={
          formData.confirmPassword && !passwordsMatch
            ? 'Las contraseñas no coinciden'
            : undefined
        }
      />

      {/* Password Requirements */}
      {formData.password && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            La contraseña debe cumplir:
          </p>
          <div className="space-y-1">
            {passwordRequirements.minLength && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                    passwordValidation.minLength
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  )}
                >
                  {passwordValidation.minLength ? '✓' : '○'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Al menos {passwordRequirements.minLength} caracteres
                </span>
              </div>
            )}
            {passwordRequirements.requireUppercase && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                    passwordValidation.hasUppercase
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  )}
                >
                  {passwordValidation.hasUppercase ? '✓' : '○'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">Una letra mayúscula</span>
              </div>
            )}
            {passwordRequirements.requireLowercase && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                    passwordValidation.hasLowercase
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  )}
                >
                  {passwordValidation.hasLowercase ? '✓' : '○'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">Una letra minúscula</span>
              </div>
            )}
            {passwordRequirements.requireNumbers && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                    passwordValidation.hasNumbers
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  )}
                >
                  {passwordValidation.hasNumbers ? '✓' : '○'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">Un número</span>
              </div>
            )}
            {passwordRequirements.requireSpecialChars && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                    passwordValidation.hasSpecialChars
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  )}
                >
                  {passwordValidation.hasSpecialChars ? '✓' : '○'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Un carácter especial (!@#$%^&*)
                </span>
              </div>
            )}
          </div>
        </div>
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
        disabled={!canSubmit}
      >
        Restablecer contraseña
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
};

ResetPasswordForm.displayName = 'ResetPasswordForm';
