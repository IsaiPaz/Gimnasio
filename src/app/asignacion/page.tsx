"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// Tipos para los datos que recibimos de la API
interface Entrenador { idUsuario: string; nombreCompleto: string; especialidad: string; }
interface Rutina { idRutina: string; nombre: string; dificultad: string; descripcion: string; }
interface UserSession { idUsuario: string; nombreCompleto: string; rol: 'miembro' | 'administrador' | 'recepcionista'; }

export default function AsignacionPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [rutinas, setRutinas] = useState<Rutina[]>([]); // La lista de rutinas ahora es dinámica
  
  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState('');
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState('');
  
  const [message, setMessage] = useState<{ type: string, text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRutinasLoading, setIsRutinasLoading] = useState(false);
  const router = useRouter();

  // Efecto para cargar los entrenadores una sola vez
  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) setSession(JSON.parse(storedSession));
    else router.push('/login');

    const fetchEntrenadores = async () => {
      try {
        const res = await fetch('/api/entrenadores');
        if (!res.ok) throw new Error("No se pudieron cargar los entrenadores.");
        setEntrenadores(await res.json());
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message });
      }
    };
    fetchEntrenadores();
  }, [router]);

  // Efecto para cargar las rutinas CADA VEZ que cambia el entrenador seleccionado
  useEffect(() => {
    if (!entrenadorSeleccionado) {
        setRutinas([]);
        return;
    }
    
    const fetchRutinasPorEntrenador = async () => {
        setIsRutinasLoading(true);
        try {
            const res = await fetch(`/api/rutinas?entrenadorId=${entrenadorSeleccionado}`);
            if (!res.ok) throw new Error("No se pudieron cargar las rutinas para este entrenador.");
            setRutinas(await res.json());
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsRutinasLoading(false);
        }
    };

    fetchRutinasPorEntrenador();
  }, [entrenadorSeleccionado]); // Este efecto se ejecuta cuando `entrenadorSeleccionado` cambia

  const handleEntrenadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEntrenadorSeleccionado(e.target.value);
      setRutinaSeleccionada(''); // Reseteamos la rutina seleccionada al cambiar de entrenador
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !entrenadorSeleccionado || !rutinaSeleccionada) {
        setMessage({ type: 'error', text: 'Debes seleccionar un entrenador y una rutina.' });
        return;
    };
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/asignaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ miembroId: session.idUsuario, entrenadorId: entrenadorSeleccionado, rutinaId: rutinaSeleccionada }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      setMessage({ type: 'success', text: result.message });
    
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
            Asignar Entrenador Personal
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="ml-4 px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition"
            title="Regresar al Dashboard"
          >
            ← 
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">1. Elige tu Entrenador</h2>
            <div className="space-y-3">
              {entrenadores.map(e => (
                <label
                  key={e.idUsuario}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    entrenadorSeleccionado === e.idUsuario
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-blue-100 bg-white hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="entrenador"
                    value={e.idUsuario}
                    checked={entrenadorSeleccionado === e.idUsuario}
                    onChange={handleEntrenadorChange}
                    className="h-5 w-5 text-blue-700 border-blue-300 focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-blue-900">{e.nombreCompleto}</p>
                    <p className="text-sm text-blue-700">{e.especialidad}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">2. Elige tu Rutina</h2>
            <div className={`space-y-3 transition-opacity duration-300 ${!entrenadorSeleccionado ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
              {isRutinasLoading && <p className="text-blue-700">Cargando rutinas...</p>}
              {!isRutinasLoading && entrenadorSeleccionado && rutinas.length === 0 && (
                <p className="text-blue-700">Este entrenador no tiene rutinas disponibles.</p>
              )}
              {rutinas.map(r => (
                <label
                  key={r.idRutina}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    rutinaSeleccionada === r.idRutina
                      ? 'bg-blue-50 border-blue-500'
                      : 'border-blue-100 bg-white hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="rutina"
                    value={r.idRutina}
                    checked={rutinaSeleccionada === r.idRutina}
                    onChange={(ev) => setRutinaSeleccionada(ev.target.value)}
                    className="h-5 w-5 text-blue-700 border-blue-300 focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-blue-900">
                      {r.nombre}{' '}
                      <span className="text-xs font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                        {r.dificultad}
                      </span>
                    </p>
                    <p className="text-sm text-blue-700">{r.descripcion}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !rutinaSeleccionada || session.rol !== 'miembro'}
              className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-blue-800 disabled:bg-blue-200 transition"
            >
              {session.rol !== 'miembro'
                ? 'Solo los miembros pueden asignarse un entrenador'
                : (isLoading ? 'Asignando...' : 'Confirmar Asignación')}
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
