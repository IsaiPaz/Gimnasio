"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Clase {
  idClase: string;
  nombre: string;
  descripcion: string;
  horario: string;
  cupoMaximo: number;
  inscritos: number;
}

interface UserSession {
  idUsuario: string;
  nombreCompleto: string;
  rol: 'miembro' | 'administrador' | 'recepcionista';
}

export default function InscripcionClasesPage() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [clasesSeleccionadas, setClasesSeleccionadas] = useState<Set<string>>(new Set());
  const [session, setSession] = useState<UserSession | null>(null);
  const [message, setMessage] = useState<{ type: string, text: string, data?: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Obtenemos la sesión del usuario desde localStorage, donde la guardamos al hacer login.
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      setSession(parsedSession);
    } else {
      // Si no hay una sesión activa, no podemos continuar. Redirigimos a la página de login.
      router.push('/login');
    }

    // Función para cargar las clases disponibles desde la API.
    async function fetchClases() {
      try {
        const response = await fetch('/api/inscripciones');
        if (!response.ok) throw new Error('No se pudieron cargar las clases.');
        const data = await response.json();
        setClases(data);
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message });
      }
    }

    fetchClases();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('session');
    router.push('/login');
  };

  const handleCheckboxChange = (idClase: string) => {
    setClasesSeleccionadas(prev => {
        const newSet = new Set(prev);
        if (newSet.has(idClase)) newSet.delete(idClase);
        else newSet.add(idClase);
        return newSet;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verificamos que tengamos una sesión válida antes de enviar.
    if (!session) return;
    
    if (clasesSeleccionadas.size === 0) {
      setMessage({ type: 'error', text: 'Por favor, selecciona al menos una clase.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Usamos el idUsuario de la sesión activa para la inscripción.
        body: JSON.stringify({ miembroId: session.idUsuario, idsClases: Array.from(clasesSeleccionadas) }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setMessage({ type: 'error', text: result.message, data: result.data });
      } else {
        setMessage({ type: 'success', text: result.message, data: result.data });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Ocurrió un error inesperado.' });
    } finally {
      setIsLoading(false);
      // Solo limpiamos la selección si la operación fue exitosa.
      if(message?.type !== 'error') setClasesSeleccionadas(new Set());
    }
  };
  
  // No renderizar la página hasta que se haya verificado la sesión para evitar parpadeos.
  if (!session) {
    return <p className="flex min-h-screen flex-col items-center justify-center">Redirigiendo al login...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inscripción a Clases</h1>
            <p className="text-gray-600">Bienvenido, {session.nombreCompleto} ({session.rol})</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
            Cerrar Sesión
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            {clases.map(clase => (
              <div key={clase.idClase} className={`p-4 border rounded-lg transition-all ${clasesSeleccionadas.has(clase.idClase) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                <label htmlFor={clase.idClase} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id={clase.idClase}
                    checked={clasesSeleccionadas.has(clase.idClase)}
                    onChange={() => handleCheckboxChange(clase.idClase)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-4 flex-grow">
                    <h2 className="font-semibold text-lg text-gray-800">{clase.nombre}</h2>
                    <p className="text-sm text-gray-600">{clase.descripcion}</p>
                    <p className="text-sm text-gray-500 mt-1"><strong>Horario:</strong> {clase.horario}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${clase.inscritos >= clase.cupoMaximo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {clase.inscritos} / {clase.cupoMaximo}
                    </span>
                    <p className="text-sm mt-1">{clase.inscritos >= clase.cupoMaximo ? 'Llena' : 'Disponible'}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div>
            <button type="submit" disabled={isLoading || session.rol !== 'miembro'} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors">
              {session.rol !== 'miembro' ? 'Solo los miembros pueden inscribirse' : (isLoading ? 'Procesando...' : `Inscribirse a ${clasesSeleccionadas.size} ${clasesSeleccionadas.size === 1 ? 'Clase' : 'Clases'}`)}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-bold">{message.text}</p>
              {message.data?.exitosas?.length > 0 && <p className="mt-2">Éxito en: {message.data.exitosas.join(', ')}</p>}
              {message.data?.fallidas?.length > 0 && (
                <div className="mt-2">
                  <p>Fallos:</p>
                  <ul className="list-disc list-inside">
                    {message.data.fallidas.map((f: any) => <li key={f.idClase}>{f.idClase}: {f.error}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
