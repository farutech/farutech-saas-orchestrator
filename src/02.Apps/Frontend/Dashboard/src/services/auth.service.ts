// ============================================================================
// AUTH SERVICE - API calls for authentication
// ============================================================================

import { apiClient } from '@/lib/api-client';
import type {
  LoginRequest,
  SecureLoginResponse,
  SelectContextRequest,
  SelectContextResponse,
  RegisterRequest,
  RegisterResponse,
  AssignUserRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/api';

// ============================================================================
// Authentication Service
// ============================================================================

export const authService = {
  /**
   * POST /api/Auth/login
   * Authenticate user credentials
   */
  login: async (credentials: LoginRequest): Promise<SecureLoginResponse> => {
    const { data } = await apiClient.post<SecureLoginResponse>(
      '/api/Auth/login',
      credentials
    );
    return data;
  },

  /**
   * POST /api/Auth/select-context
   * Select organization context after login
   * NOTA: Este endpoint NO requiere Bearer token, usa intermediateToken en el body
   */
  selectContext: async (
    request: SelectContextRequest
  ): Promise<SelectContextResponse> => {
    // No usar apiClient que agrega el header Authorization automáticamente
    const response = await fetch('http://localhost:5098/api/Auth/select-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al seleccionar contexto' }));
      throw new Error(error.message || 'Error al seleccionar contexto');
    }

    return response.json();
  },

  /**
   * POST /api/Auth/register
   * Register a new user
   */
  register: async (request: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>(
      '/api/Auth/register',
      request
    );
    return data;
  },

  /**
   * POST /api/Auth/assign-user
   * Assign user to customer/organization
   */
  assignUser: async (request: AssignUserRequest): Promise<void> => {
    await apiClient.post('/api/Auth/assign-user', request);
  },

  /**
   * POST /api/Auth/forgot-password
   * Request password reset token
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const { data } = await apiClient.post<ForgotPasswordResponse>(
      '/api/Auth/forgot-password',
      { email }
    );
    return data;
  },

  /**
   * POST /api/Auth/reset-password
   * Reset password with token
   */
  resetPassword: async (
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ResetPasswordResponse> => {
    const { data } = await apiClient.post<ResetPasswordResponse>(
      '/api/Auth/reset-password',
      { email, token, newPassword, confirmPassword }
    );
    return data;
  },

  /**
   * GET /api/Auth/validate-reset-token
   * Validate password reset token before showing form
   */
  validateResetToken: async (email: string, token: string): Promise<boolean> => {
    const { data } = await apiClient.get<{ isValid: boolean }>(
      '/api/Auth/validate-reset-token',
      { params: { email, token } }
    );
    return data.isValid;
  },

  /**
   * GET /api/Auth/confirm-email
   * Confirm user email with token
   */
  confirmEmail: async (userId: string, code: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.get<{ success: boolean; message: string }>(
      '/api/Auth/confirm-email',
      { params: { userId, code } }
    );
    return data;
  },
};
