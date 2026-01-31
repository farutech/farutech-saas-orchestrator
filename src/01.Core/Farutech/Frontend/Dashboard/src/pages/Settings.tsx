import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFarutech } from '@/contexts/FarutechContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Lock, Bell, Palette, Save, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, isDark, toggleTheme } = useFarutech();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 234 567 890',
    bio: 'Administrador del sistema Farutech',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Perfil actualizado',
      description: 'Los cambios han sido guardados exitosamente',
    });
  };

  const handleSavePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Contraseña actualizada',
      description: 'Tu contraseña ha sido cambiada exitosamente',
    });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Configuración</h1>
          <p className="text-muted-foreground mb-8">
            Administra tu cuenta y preferencias del sistema
          </p>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Seguridad</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificaciones</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Apariencia</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Perfil</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y foto de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Cambiar foto
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        JPG, PNG o GIF. Máximo 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select defaultValue="es">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                  <CardDescription>
                    Actualiza tu contraseña de acceso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleSavePassword} className="gap-2">
                    <Lock className="h-4 w-4" />
                    Actualizar Contraseña
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de Notificación</CardTitle>
                  <CardDescription>
                    Configura cómo quieres recibir notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones importantes por correo
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones Push</p>
                      <p className="text-sm text-muted-foreground">
                        Recibe alertas en tiempo real en el navegador
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones SMS</p>
                      <p className="text-sm text-muted-foreground">
                        Recibe mensajes de texto para alertas críticas
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Comunicaciones de Marketing</p>
                      <p className="text-sm text-muted-foreground">
                        Recibe noticias sobre productos y ofertas
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, marketing: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Apariencia</CardTitle>
                  <CardDescription>
                    Personaliza la apariencia del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Modo Oscuro</p>
                      <p className="text-sm text-muted-foreground">
                        Activa el tema oscuro para reducir la fatiga visual
                      </p>
                    </div>
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
