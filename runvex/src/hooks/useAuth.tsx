import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { obtenerSesionActiva, cerrarSesion } from '../database/database';

interface Usuario {
  id: number; nombre: string; apellidos: string;
  correo: string; usuario: string; racha: number; foto_perfil?: string;
}
interface AuthCtx {
  usuario: Usuario | null;
  setUsuario: (u: Usuario | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx>({
  usuario: null, setUsuario: () => {}, logout: async () => {}, loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerSesionActiva()
      .then(s => { if (s) setUsuario(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => { await cerrarSesion(); setUsuario(null); };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
