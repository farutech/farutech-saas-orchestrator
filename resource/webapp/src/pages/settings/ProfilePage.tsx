/**
 * Página de perfil del usuario
 */

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CameraIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { notify } from '@/store/notificationStore'

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Usuario Demo',
    email: 'demo@example.com',
    phone: '+57 300 123 4567',
    location: 'Bogotá, Colombia',
    bio: 'Administrador del sistema',
  })

  const handleSave = () => {
    notify.success('Perfil actualizado', 'Los cambios se han guardado correctamente')
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna izquierda - Avatar y estadísticas */}
        <div className="space-y-4">
          <Card>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-20 w-20 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <CameraIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sesiones activas</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Último acceso</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Hoy, 9:05 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Miembro desde</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Ene 2024</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna central y derecha - Información */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Información Personal</h3>
              <Button variant={isEditing ? 'secondary' : 'primary'} size="sm" onClick={() => setIsEditing((s) => !s)}>
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} disabled={!isEditing} className="pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={!isEditing} className="pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                <div className="relative">
                  <PhoneInput value={profile.phone} onChange={(val) => setProfile({ ...profile, phone: val })} placeholder="Número de teléfono" className="w-full" disabled={!isEditing} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ubicación</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} disabled={!isEditing} className="pl-10" />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} variant="primary">Guardar cambios</Button>
                  <Button onClick={() => setIsEditing(false)} variant="secondary">Cancelar</Button>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Seguridad</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                <div className="flex items-center gap-3">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Cambiar contraseña</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Actualiza tu contraseña regularmente</p>
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Autenticación de dos factores</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Agrega una capa extra de seguridad</p>
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left">
                <div className="flex items-center gap-3">
                  <BellIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Notificaciones</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Configura tus preferencias</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
 
