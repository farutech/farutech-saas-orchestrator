// ============================================================================
// USER PROFILE PAGE
// ============================================================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Phone, Lock, Save, Edit, X, ArrowLeft } from 'lucide-react';
import { UserProfileDto, UpdateProfileRequest, UpdateProfileResponse } from '@/types/api';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Cambiado a true por defecto
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Cargar perfil del usuario
  useEffect(() => {
    let mounted = true;
    
    const loadProfile = async () => {
      try {
        console.log('[ProfilePage] === STARTING PROFILE LOAD ===');
        
        // Check token
        const token = localStorage.getItem('farutech_access_token');
        console.log('[ProfilePage] Token exists:', !!token);
        if (token) {
          console.log('[ProfilePage] Token length:', token.length);
          console.log('[ProfilePage] Token preview:', token.substring(0, 50) + '...');
        }
        
        setLoading(true);
        console.log('[ProfilePage] Making request to /api/Auth/me...');
        const response = await apiClient.get<UserProfileDto>('/api/Auth/me');
        console.log('[ProfilePage] Response received!');
        console.log('[ProfilePage] Profile loaded:', response.data);
        
        if (!mounted) return;
        
        setProfile(response.data);
        const data = {
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phone: response.data.phone || '',
        };
        setFormData(data);
        setOriginalData(data);
      } catch (error: any) {
        console.error('[ProfilePage] === ERROR LOADING PROFILE ===');
        console.error('[ProfilePage] Error object:', error);
        console.error('[ProfilePage] Error message:', error.message);
        console.error('[ProfilePage] Error status:', error.status);
        console.error('[ProfilePage] Error response:', error.response);
        
        if (!mounted) return;
        
        // Don't show toast if we're being redirected (401 error is handled by interceptor)
        if (error.status !== 401) {
          toast({
            variant: 'destructive',
            title: 'Error al cargar perfil',
            description: error.message || 'No se pudo cargar el perfil',
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo cargar una vez al montar

  const handleCancelEdit = () => {
    setFormData(originalData);
    setEditMode(false);
  };
  
  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setEditPasswordMode(false);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      const updateRequest: UpdateProfileRequest = {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
      };

      const response = await apiClient.put<UpdateProfileResponse>('/api/Auth/me', updateRequest);

      if (response.data.success) {
        toast({
          title: 'Éxito',
          description: response.data.message || 'Perfil actualizado correctamente',
        });

        // Actualizar perfil local
        if (response.data.profile) {
          setProfile(response.data.profile);
          const data = {
            firstName: response.data.profile.firstName,
            lastName: response.data.profile.lastName,
            phone: response.data.profile.phone || '',
          };
          setFormData(data);
          setOriginalData(data);
        }
        
        setEditMode(false);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el perfil',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      if (!passwordData.currentPassword) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Debes ingresar tu contraseña actual',
        });
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Las contraseñas no coinciden',
        });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'La nueva contraseña debe tener al menos 6 caracteres',
        });
        return;
      }
      
      const updateRequest: UpdateProfileRequest = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      const response = await apiClient.put<UpdateProfileResponse>('/api/Auth/me', updateRequest);

      if (response.data.success) {
        toast({
          title: 'Éxito',
          description: response.data.message || 'Contraseña actualizada correctamente',
        });

        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setEditPasswordMode(false);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar la contraseña',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Header - Same as Launcher Page */}
      <AppHeader title="Mi Perfil" showBackToLauncher={true} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mi Perfil</h1>
            <p className="text-slate-500 text-sm mt-1">Administra tu información personal y configuración de cuenta</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/launcher')}
            className="gap-2 w-full md:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Launcher
          </Button>
        </div>

        <Separator className="bg-slate-200" />

        {/* Content */}
        <div className="space-y-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>Actualiza tu nombre y datos de contacto</CardDescription>
              </div>
              {!editMode && (
                <Button
                  variant="outline"
                  onClick={() => setEditMode(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Juan"
                    disabled={!editMode}
                    className={!editMode ? 'bg-muted cursor-not-allowed' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Pérez"
                    disabled={!editMode}
                    className={!editMode ? 'bg-muted cursor-not-allowed' : ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">El email no puede ser modificado</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+51 999 999 999"
                  disabled={!editMode}
                  className={!editMode ? 'bg-muted cursor-not-allowed' : ''}
                />
              </div>

              {editMode && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        
        {/* Cambiar Contraseña - Card Independiente */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
              </div>
              {!editPasswordMode && (
                <Button
                  variant="outline"
                  onClick={() => setEditPasswordMode(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Cambiar
                </Button>
              )}
            </div>
          </CardHeader>
          {editPasswordMode && (
            <CardContent>
              <form onSubmit={handleSubmitPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelPassword}
                    disabled={saving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Contraseña
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
        </div>
      </main>
    </div>
  );
}
