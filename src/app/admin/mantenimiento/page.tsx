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

  if (!session) return <p className="text-center text-lg font-semibold text-gray-800">Cargando...</p>;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-lg text-center tracking-tight flex-1">
            Gestión de Mantenimiento
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="ml-4 px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition"
            title="Regresar al Dashboard"
          >
            ←
          </button>
        </div>
        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl border border-blue-200">
          {isLoading && <p className="text-blue-700 font-medium text-center">Cargando notificaciones...</p>}
          {error && <p className="text-red-600 font-semibold text-center">{error}</p>}
          {!isLoading && notificaciones.length === 0 && (
            <p className="text-gray-700 text-center font-medium">No hay reportes de fallas activos.</p>
          )}
          <div className="space-y-6">
            {notificaciones.map(n => (
              <div
                key={n.idNotificacion}
                className="border border-blue-100 bg-white/95 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex-1">
                  <p className="font-bold text-xl text-blue-900 mb-1">{n.nombreEquipo}</p>
                  <p className="text-base text-gray-800">
                    Falla reportada por <span className="font-semibold text-blue-700">{n.nombreMiembro}</span>
                  </p>
                  <p className="text-base text-gray-700 italic mt-2">"{n.descripcionFalla}"</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reportado el: <span className="font-semibold">{new Date(n.fechaReporte).toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0 md:ml-8">
                  <span
                    className={`px-4 py-1 text-sm font-bold rounded-full border shadow-sm
                      ${
                        n.estadoEquipo === 'Dañado'
                          ? 'bg-red-200 text-red-900 border-red-300'
                          : n.estadoEquipo === 'En Mantenimiento'
                          ? 'bg-yellow-200 text-yellow-900 border-yellow-300'
                          : n.estadoEquipo === 'Operativo'
                          ? 'bg-green-200 text-green-900 border-green-300'
                          : 'bg-gray-300 text-gray-900 border-gray-400'
                      }
                    `}
                  >
                    {n.estadoEquipo}
                  </span>
                  <select
                    value={n.estadoEquipo}
                    onChange={(e) => handleEstadoChange(n.idEquipo, e.target.value as EquipoEstado)}
                    className="border-blue-300 rounded-md shadow-sm px-3 py-2 text-base font-medium text-blue-900 bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
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
