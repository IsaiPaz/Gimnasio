"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface ProgresoFisico {
  idProgreso: string;
  fechaRegistro: string; // La fecha viene como string
  peso?: number;
  medidasCorporales?: { pecho?: number, cintura?: number, brazos?: number };
  porcentajeGrasa?: number;
  observaciones?: string;
}

interface UserSession {
  idUsuario: string;
  nombreCompleto: string;
  rol: 'miembro' | 'administrador' | 'recepcionista';
}

export default function ProgresoPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [historial, setHistorial] = useState<ProgresoFisico[]>([]);
  const [formData, setFormData] = useState({ peso: '', pecho: '', cintura: '', brazos: '', porcentajeGrasa: '', observaciones: '' });
  const [message, setMessage] = useState<{ type: string, text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession);
      setSession(parsedSession);
      fetchHistorial(parsedSession.idUsuario);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchHistorial = async (miembroId: string) => {
    try {
      const response = await fetch(`/api/miembros/${miembroId}/progreso`);
      if (!response.ok) throw new Error('No se pudo cargar el historial.');
      const data = await response.json();
      setHistorial(data);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    setIsLoading(true);
    setMessage(null);

    const datosParaEnviar = {
      peso: parseFloat(formData.peso) || null,
      porcentajeGrasa: parseFloat(formData.porcentajeGrasa) || null,
      observaciones: formData.observaciones,
      medidasCorporales: {
        pecho: parseFloat(formData.pecho) || null,
        cintura: parseFloat(formData.cintura) || null,
        brazos: parseFloat(formData.brazos) || null
      }
    };

    try {
      const response = await fetch(`/api/miembros/${session.idUsuario}/progreso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      
      setMessage({ type: 'success', text: 'Progreso guardado exitosamente!' });
      setHistorial([result.data, ...historial]); // Añadir el nuevo registro al inicio de la lista
      setFormData({ peso: '', pecho: '', cintura: '', brazos: '', porcentajeGrasa: '', observaciones: '' }); // Limpiar formulario
    
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!session) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna del Formulario */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrar Nuevo Progreso</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="peso" className="block text-sm font-medium text-gray-700">Peso (kg)</label>
              <input type="number" step="0.5" name="peso" value={formData.peso} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-medium text-gray-700 px-2">Medidas (cm)</legend>
              <div className="grid grid-cols-3 gap-2">
                <div><label htmlFor="pecho" className="text-xs">Pecho</label><input type="number" step="0.5" name="pecho" value={formData.pecho} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/></div>
                <div><label htmlFor="cintura" className="text-xs">Cintura</label><input type="number" step="0.5" name="cintura" value={formData.cintura} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/></div>
                <div><label htmlFor="brazos" className="text-xs">Brazos</label><input type="number" step="0.5" name="brazos" value={formData.brazos} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/></div>
              </div>
            </fieldset>
             <div>
              <label htmlFor="porcentajeGrasa" className="block text-sm font-medium text-gray-700">% Grasa Corporal</label>
              <input type="number" step="0.5" name="porcentajeGrasa" value={formData.porcentajeGrasa} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones</label>
              <textarea name="observaciones" rows={3} value={formData.observaciones} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
              {isLoading ? 'Guardando...' : 'Guardar Progreso'}
            </button>
            {message && <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
          </form>
        </div>

        {/* Columna del Historial */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Historial de Progreso</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {historial.length > 0 ? historial.map(p => (
              <div key={p.idProgreso} className="p-4 border rounded-md">
                <p className="font-semibold text-gray-700">{new Date(p.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                  {p.peso && <p><strong>Peso:</strong> {p.peso} kg</p>}
                  {p.porcentajeGrasa && <p><strong>Grasa:</strong> {p.porcentajeGrasa}%</p>}
                  {p.medidasCorporales?.pecho && <p><strong>Pecho:</strong> {p.medidasCorporales.pecho} cm</p>}
                  {p.medidasCorporales?.cintura && <p><strong>Cintura:</strong> {p.medidasCorporales.cintura} cm</p>}
                  {p.medidasCorporales?.brazos && <p><strong>Brazos:</strong> {p.medidasCorporales.brazos} cm</p>}
                </div>
                {p.observaciones && <p className="text-sm text-gray-600 mt-2"><em>"{p.observaciones}"</em></p>}
              </div>
            )) : <p>No hay registros de progreso todavía. ¡Añade uno para empezar!</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
