// ============================================================================
// REGISTER FORM - Formulario de registro de usuarios
// ============================================================================
// Componente NUEVO (no existe en resource/webapp)
// Incluye validación de email, contraseña y términos

import React, { useState, useMemo } from 'react';
import { Button } from '../Button';
import { Input } from '../Forms/Input';
import { Checkbox } from '../Forms/Checkbox';
import { Alert } from '../Feedback/Alert';
import { cn } from '../../lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface RegisterFormData {
  fullName: string;
  email: string;
  companyName?: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export interface RegisterFormProps {
  /** Handler cuando se envía el formulario */
  onSubmit: (data: RegisterFormData) => void | Promise<void>;
  /** Estado de carga */
  isLoading?: boolean;
  /** Error a mostrar */
  error?: string | null;
  /** Mostrar campo de empresa */
  showCompanyField?: boolean;
  /** Handler para ir al login */
  onGoToLogin?: () => void;
  /** URL de términos y condiciones */
  termsUrl?: string;
  /** URL de política de privacidad */
  privacyUrl?: string;
  /** Texto del botón de submit */
  submitText?: string;
  /** Clases CSS adicionales */
  className?: string;
}

// ============================================================================
// Password Strength Calculation (simplified)
// ============================================================================

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
  
  return Math.min(strength, 100);
};

const getStrengthColor = (strength: number): string => {
  if (strength < 40) return 'bg-red-500';
  if (strength < 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

// ============================================================================
// Component
// ============================================================================

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  showCompanyField = true,
  onGoToLogin,
  termsUrl = '/terms',
  privacyUrl = '/privacy',
  submitText = 'Crear cuenta',
  className,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================================
  // Validation
  // ============================================================================

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.password),
    [formData.password]
  );

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isPasswordStrong = passwordStrength >= 40;
  
  const canSubmit =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    passwordsMatch &&
    isPasswordStrong &&
    formData.acceptedTerms;

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    await onSubmit(formData);
  };

  const handleChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)}>
      {/* Full Name Input */}
      <Input
        id="fullName"
        name="fullName"
        type="text"
        label="Nombre completo"
        placeholder="Juan Pérez"
        value={formData.fullName}
        onChange={handleChange('fullName')}
        disabled={isLoading}
        required
        autoComplete="name"
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        }
      />

      {/* Email Input */}
      <Input
        id="email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="usuario@empresa.com"
        value={formData.email}
        onChange={handleChange('email')}
        disabled={isLoading}
        required
        autoComplete="email"
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

      {/* Company Name Input (Optional) */}
      {showCompanyField && (
        <Input
          id="companyName"
          name="companyName"
          type="text"
          label="Empresa (opcional)"
          placeholder="Mi Empresa S.A."
          value={formData.companyName}
          onChange={handleChange('companyName')}
          disabled={isLoading}
          autoComplete="organization"
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
      )}

      {/* Password Input */}
      <div>
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange('password')}
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
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  getStrengthColor(passwordStrength)
                )}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
            </p>
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

      {/* Terms & Conditions */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="acceptedTerms"
          name="acceptedTerms"
          checked={formData.acceptedTerms}
          onChange={handleChange('acceptedTerms')}
          disabled={isLoading}
          required
        />
        <label htmlFor="acceptedTerms" className="text-sm text-gray-600 dark:text-gray-400">
          Acepto los{' '}
          <a
            href={termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
          >
            términos y condiciones
          </a>{' '}
          y la{' '}
          <a
            href={privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
          >
            política de privacidad
          </a>
        </label>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Error en el registro">
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
        {submitText}
      </Button>

      {/* Link to Login */}
      {onGoToLogin && (
        <div className="text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              disabled={isLoading}
            >
              Inicia sesión
            </button>
          </span>
        </div>
      )}
    </form>
  );
};

RegisterForm.displayName = 'RegisterForm';
