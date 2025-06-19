/*
 * Página para que el admin vea y gestione las notificaciones de mantenimiento.
 */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Tipos de datos que esperamos de la API
interface Notificacion {
  idNotificacion: string;
  fechaReporte: string;
  descripcionFalla: string;
  idEquipo: string;
  nombreEquipo: string;
  estadoEquipo: 'Operativo' | 'Dañado' | 'En Mantenimiento' | 'De Baja';
  nombreMiembro: string;
}
type EquipoEstado = Notificacion['estadoEquipo'];
interface UserSession { idUsuario: string; nombreCompleto: string; rol: string; }

export default function MantenimientoAdminPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      if (parsedSession.rol !== 'administrador') {
        router.push('/dashboard'); // Redirigir si no es admin
      }
      setSession(parsedSession);
    } else {
      router.push('/login');
    }
  }, [router]);
  
  // Función para cargar las notificaciones
  const fetchNotificaciones = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mantenimiento/notificaciones');
      if (!res.ok) throw new Error("No se pudieron cargar las notificaciones.");
      const data = await res.json();
      setNotificaciones(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchNotificaciones();
  }, [session]);
  
  const handleEstadoChange = async (idEquipo: string, nuevoEstado: EquipoEstado) => {
    if (!session) return;
    try {
      const response = await fetch(`/api/equipos/${idEquipo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado, idAdmin: session.idUsuario }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Error al actualizar el estado.');
      }
      // Actualizar la lista para reflejar el cambio
      fetchNotificaciones();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!session) return <p>Cargando...</p>;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Mantenimiento</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isLoading && <p>Cargando notificaciones...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && notificaciones.length === 0 && <p>No hay reportes de fallas activos.</p>}
          <div className="space-y-4">
            {notificaciones.map(n => (
              <div key={n.idNotificacion} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{n.nombreEquipo}</p>
                  <p className="text-sm text-gray-600">Falla reportada por <span className="font-semibold">{n.nombreMiembro}</span></p>
                  <p className="text-sm text-gray-500 italic mt-1">"{n.descripcionFalla}"</p>
                   <p className="text-xs text-gray-400">Reportado el: {new Date(n.fechaReporte).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${n.estadoEquipo === 'Dañado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {n.estadoEquipo}
                    </span>
                    <select 
                        value={n.estadoEquipo}
                        onChange={(e) => handleEstadoChange(n.idEquipo, e.target.value as EquipoEstado)}
                        className="border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="Dañado">Dañado</option>
                        <option value="En Mantenimiento">En Mantenimiento</option>
                        <option value="Operativo">Operativo</option>
                        <option value="De Baja">De Baja</option>
                    </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
