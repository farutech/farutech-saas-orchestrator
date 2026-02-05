// ============================================================================
// FARUTECH API TYPES - Generated from OpenAPI 3.0.1
// DO NOT EDIT MANUALLY - Regenerate from swagger.json
// ============================================================================

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginRequest {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SecureLoginResponse {
  requiresContextSelection: boolean;
  intermediateToken?: string;
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  availableTenants?: TenantOptionDto[];
  selectedTenantId?: string;
  companyName?: string;
  role?: string;
}

export interface SelectContextRequest {
  intermediateToken?: string;
  tenantId: string;
}

export interface SelectContextResponse {
  accessToken?: string;
  tokenType?: string;
  expiresIn: number;
  tenantId: string;
  companyName?: string;
  role?: string;
}

export interface RegisterRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  createDefaultOrganization?: boolean;
}

export interface RegisterResponse {
  userId: string;
  email?: string;
  fullName?: string;
  organizationId?: string;
  organizationName?: string;
}

export interface AssignUserRequest {
  userId: string;
  customerId: string;
  role?: string;
}

export interface TenantOptionDto {
  tenantId: string;
  companyName?: string;
  companyCode?: string;
  taxId?: string;
  role?: string;
  isOwner?: boolean;
  isActive?: boolean;
  instances?: InstanceDto[];
}

export interface InstanceDto {
  instanceId: string;
  name: string;
  type: string;
  code: string;
  status: string;
  url: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  mockResetUrl?: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface UserProfileDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  profile?: UserProfileDto;
}

export interface UserContextResponse {
  userId: string;
  email: string;
  fullName: string;
  organizations: OrganizationContextDto[];
}

export interface OrganizationContextDto {
  organizationId: string;
  organizationName: string;
  organizationCode: string;
  taxId?: string;
  isOwner: boolean;
  isActive: boolean;
  role: string;
  instances: InstanceContextDto[];
}

export interface InstanceContextDto {
  instanceId: string;
  code: string;
  name: string;
  applicationType: string;
  status: string;
  url: string;
  hasDirectAssignment: boolean;
}

// ============================================================================
// Catalog Types
// ============================================================================

export interface ProductDto {
  id: string;
  name?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  modules?: ModuleDto[];
}

export interface CreateProductDto {
  name: string;
  description: string;
}

export interface UpdateProductDto {
  name: string;
  description: string;
  isActive: boolean;
}

export interface ModuleDto {
  id: string;
  productId: string;
  productName?: string;
  name?: string;
  description?: string;
  isActive: boolean;
  deploymentType?: string; // 'Shared' (compartido) o 'Dedicated' (dedicado)
  isRequired?: boolean;
  createdAt: string;
  updatedAt?: string;
  features?: FeatureDto[];
}

export interface CreateModuleDto {
  productId: string;
  name: string;
  description: string;
}

export interface UpdateModuleDto {
  name: string;
  description: string;
  isActive: boolean;
}

export interface FeatureDto {
  id: string;
  moduleId: string;
  moduleName?: string;
  name?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFeatureDto {
  moduleId: string;
  name: string;
  description: string;
}

export interface UpdateFeatureDto {
  name: string;
  description: string;
  isActive: boolean;
}

// ============================================================================
// Product Manifest Types (for marketplace and provisioning)
// ============================================================================

export interface ProductManifestDto {
  id: string;
  name?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  modules?: ModuleManifestDto[];
  subscriptionPlans?: SubscriptionPlanDto[];
}

export interface ModuleManifestDto {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  features?: FeatureManifestDto[];
}

export interface FeatureManifestDto {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  isActive: boolean;
  requiresLicense: boolean;
  additionalCost?: number;
  createdAt: string;
  updatedAt?: string;
  permissions?: PermissionDto[];
}

export interface PermissionDto {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  module?: string;
  category?: string;
  isCritical: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// Subscription Plan Types
// ============================================================================

export interface SubscriptionPlanDto {
  id: string;
  productId: string;
  code: string;
  name: string;
  description: string;
  isFullAccess: boolean;
  monthlyPrice: number;
  annualPrice?: number;
  isActive: boolean;
  isRecommended: boolean;
  displayOrder: number;
  limits?: SubscriptionLimitsDto;
  features?: FeatureDto[];
}

export interface SubscriptionLimitsDto {
  maxUsers: number; // -1 = unlimited
  maxTransactionsPerMonth: number; // -1 = unlimited
  storageGB: number; // -1 = unlimited
  maxWarehouses: number; // -1 = unlimited
  supportLevel: string; // 'standard', 'priority', 'premium'
  hasAdvancedReports: boolean;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  code?: string;
  companyName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  tenantInstances?: TenantInstance[];
  subscriptions?: Subscription[];
  userMemberships?: UserCompanyMembership[];
}

export interface CreateCustomerRequest {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  adminUserId: string;
}

export interface CreateCustomerResponse {
  customerId: string;
  companyName: string;
  code: string;
  message: string;
}

export interface UpdateCustomerRequest {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  isActive?: boolean;
}

// ============================================================================
// Tenant Instance Types
// ============================================================================

export interface PagedOrganizationsResponse {
  organizations: Customer[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export type OrganizationDto = Customer; // Alias for consistency if needed

export interface TenantInstance {
  id: string;
  name?: string;
  code?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  customerId: string;
  tenantCode?: string;
  environment?: string;
  status?: string;
  connectionString?: string;
  apiBaseUrl?: string;
  activeFeaturesJson?: string;
  provisionedAt?: string;
  lastAccessAt?: string;
  customer?: Customer;
}

// ============================================================================
// Provisioning Types
// ============================================================================

export interface ProvisionTenantRequest {
  customerId: string;
  productId: string;
  deploymentType?: string; // 'Shared' (compartido) o 'Dedicated' (dedicado)
  subscriptionPlanId: string; // ID del plan de suscripción seleccionado
  code?: string; // Código único de la instancia (sin espacios ni caracteres especiales)
  name?: string; // Nombre descriptivo de la instancia
  customFeatures?: Record<string, unknown>;
}

export interface ProvisionTenantResponse {
  tenantInstanceId: string;
  tenantCode?: string;
  status?: string;
  taskId?: string;
  createdAt: string;
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface Subscription {
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  customerId: string;
  productId: string;
  subscriptionType?: string;
  price: number;
  status?: string;
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  maxUsers: number;
  subscribedModulesJson?: string;
  customFeaturesJson?: string;
  customer?: Customer;
}

// ============================================================================
// User Types
// ============================================================================

export interface ApplicationUser {
  id: string;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed: boolean;
  passwordHash?: string;
  securityStamp?: string;
  concurrencyStamp?: string;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  companyMemberships?: UserCompanyMembership[];
  fullName?: string;
}

export interface UserCompanyMembership {
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  userId: string;
  user?: ApplicationUser;
  customerId: string;
  customer?: Customer;
  role?: string;
  isActive: boolean;
  grantedAt: string;
  grantedBy?: string;
}

// ============================================================================
// Organization Summary Types (for Dashboard)
// ============================================================================

export interface OrganizationSummaryDto {
  totalApps: number;
  activeApps: number;
  inactiveApps: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  billingStatus: 'Al día' | 'Pago Pendiente' | 'Próximo Vencimiento';
  nextBillingDate?: string;
}

export interface ApplicationDetailDto {
  id: string;
  name: string;
  code: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Provisioning';
  url?: string;
  dashboardUrl?: string;
  environment?: string;
  version?: string;
  provisionedAt?: string;
  lastAccessAt?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

// ============================================================================
// API Response Wrapper (for consistent handling)
// ============================================================================

export type ApiResponse<T> = {
  data: T;
  status: number;
  statusText: string;
};

export type ApiError = {
  message: string;
  status?: number;
  details?: ProblemDetails;
};
