import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de usuario
    const loadUser = async () => {
      try {
        // Aquí iría la lógica real para obtener el usuario
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com'
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Lógica de login
    console.log('Logging in:', email, password);
  };

  const logout = async () => {
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};