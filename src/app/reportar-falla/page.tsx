"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Equipo { idEquipo: string; nombre: string; marca: string; }
interface UserSession { idUsuario: string; nombreCompleto: string; rol: 'miembro' | 'administrador' | 'recepcionista'; }

export default function ReportarFallaPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [descripcionFalla, setDescripcionFalla] = useState('');
  
  const [message, setMessage] = useState<{ type: string, text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) setSession(JSON.parse(storedSession));
    else router.push('/login');

    const fetchEquipos = async () => {
      try {
        const res = await fetch('/api/equipos');
        if (!res.ok) throw new Error("No se pudieron cargar los equipos.");
        const data = await res.json();
        setEquipos(data);
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message });
      }
    };
    fetchEquipos();
  }, [router]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !equipoSeleccionado || !descripcionFalla) {
        setMessage({ type: 'error', text: 'Debes seleccionar un equipo y describir la falla.' });
        return;
    };
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/mantenimiento/reportar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idEquipo: equipoSeleccionado,
            miembroId: session.idUsuario,
            descripcionFalla: descripcionFalla
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      setMessage({ type: 'success', text: result.message });
      setEquipoSeleccionado('');
      setDescripcionFalla('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!session) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-white p-8">
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl border border-blue-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 drop-shadow-lg tracking-tight flex-1">
            Reportar Falla de Equipo
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="ml-4 px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition"
            title="Regresar al Dashboard"
          >
            ← 
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="equipo" className="block text-base font-semibold text-blue-900 mb-1">
              1. Selecciona el Equipo Dañado
            </label>
            <select
              id="equipo"
              value={equipoSeleccionado}
              onChange={(e) => setEquipoSeleccionado(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm text-blue-900 font-medium bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            >
              <option value="" disabled>-- Elige un equipo --</option>
              {equipos.map(eq => (
                <option key={eq.idEquipo} value={eq.idEquipo}>
                  {eq.nombre} ({eq.marca})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-base font-semibold text-blue-900 mb-1">
              2. Describe la Falla
            </label>
            <textarea
              id="descripcion"
              value={descripcionFalla}
              onChange={(e) => setDescripcionFalla(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              placeholder="Ej: La pantalla no enciende, hace un ruido extraño al usarla, etc."
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading || session.rol !== 'miembro'}
              className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-orange-700 disabled:bg-blue-200 transition"
            >
              {session.rol !== 'miembro'
                ? 'Solo los miembros pueden reportar fallas'
                : (isLoading ? 'Enviando Reporte...' : 'Enviar Reporte de Falla')}
            </button>
          </div>
          {message && (
            <div className={`p-4 mt-4 rounded-md text-base font-semibold text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
