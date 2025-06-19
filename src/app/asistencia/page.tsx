"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Clase {
  idClase: string;
  nombre: string;
  horario: string;
}

interface UserSession {
  idUsuario: string;
  nombreCompleto: string;
  rol: 'miembro' | 'administrador' | 'recepcionista';
}

export default function AsistenciaPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [clases, setClases] = useState<Clase[]>([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [message, setMessage] = useState<{ type: string, text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      router.push('/login');
    }

    async function fetchClases() {
      const response = await fetch('/api/inscripciones'); // Reutilizamos el endpoint que obtiene las clases
      const data = await response.json();
      setClases(data);
      if (data.length > 0) {
        setClaseSeleccionada(data[0].idClase); // Seleccionar la primera por defecto
      }
    }
    fetchClases();
  }, [router]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !claseSeleccionada) return;
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ miembroId: session.idUsuario, claseId: claseSeleccionada }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      setMessage({ type: 'success', text: `¡Hola ${session.nombreCompleto}! Asistencia registrada con éxito.` });
    
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!session) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-2xl border border-blue-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-lg text-center tracking-tight flex-1">
            Control de Asistencia
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="ml-4 px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition"
            title="Regresar al Dashboard"
          >
            ← 
          </button>
        </div>
        <p className="text-blue-700 mb-6 text-center font-medium">
          Bienvenido, {session.nombreCompleto}. Registrar tu asistencia.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="clase" className="block text-base font-semibold text-blue-900 mb-1">
              Clase de Hoy
            </label>
            <select
              id="clase"
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(e.target.value)}
              className="block w-full px-3 py-3 bg-blue-50 border border-blue-300 rounded-md shadow-sm text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            >
              {clases.map(c => (
                <option key={c.idClase} value={c.idClase}>
                  {c.nombre} ({c.horario})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading || !claseSeleccionada}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-blue-200 transition"
            >
              {isLoading ? 'Registrando...' : 'Confirmar Asistencia'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-md text-center text-base font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
      </div>
    </main>
  );
}
