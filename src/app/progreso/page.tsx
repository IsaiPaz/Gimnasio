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
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna del Formulario */}
        <div className="lg:col-span-1 bg-white/90 p-6 rounded-2xl shadow-2xl border border-blue-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-blue-900 drop-shadow-lg tracking-tight flex-1">
              Registrar Nuevo Progreso
            </h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="ml-4 px-4 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition"
              title="Regresar al Dashboard"
            >
              ← 
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="peso" className="block text-base font-semibold text-blue-900 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <fieldset className="border border-blue-200 p-4 rounded-md">
              <legend className="text-base font-semibold text-blue-900 px-2">Medidas (cm)</legend>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="pecho" className="text-xs text-blue-900">Pecho</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    name="pecho"
                    value={formData.pecho}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                  />
                </div>
                <div>
                  <label htmlFor="cintura" className="text-xs text-blue-900">Cintura</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    name="cintura"
                    value={formData.cintura}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                  />
                </div>
                <div>
                  <label htmlFor="brazos" className="text-xs text-blue-900">Brazos</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    name="brazos"
                    value={formData.brazos}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                  />
                </div>
              </div>
            </fieldset>
            <div>
              <label htmlFor="porcentajeGrasa" className="block text-base font-semibold text-blue-900 mb-1">% Grasa Corporal</label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="porcentajeGrasa"
                value={formData.porcentajeGrasa}
                onChange={handleChange}
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label htmlFor="observaciones" className="block text-base font-semibold text-blue-900 mb-1">Observaciones</label>
              <textarea name="observaciones" rows={3} value={formData.observaciones} onChange={handleChange}
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"></textarea>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition">
              {isLoading ? 'Guardando...' : 'Guardar Progreso'}
            </button>
            {message && <p className={`mt-2 text-base font-semibold text-center ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</p>}
          </form>
        </div>

        {/* Columna del Historial */}
        <div className="lg:col-span-2 bg-white/90 p-6 rounded-2xl shadow-2xl border border-blue-200">
          <h2 className="text-2xl font-extrabold text-blue-900 mb-4 drop-shadow-lg tracking-tight">Historial de Progreso</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {historial.length > 0 ? historial.map(p => (
              <div key={p.idProgreso} className="p-4 border border-blue-100 rounded-xl bg-white/95 shadow hover:shadow-lg transition">
                <p className="font-bold text-blue-900">{new Date(p.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-base mt-2 text-blue-900">
                  {p.peso && <p><strong>Peso:</strong> {p.peso} kg</p>}
                  {p.porcentajeGrasa && <p><strong>Grasa:</strong> {p.porcentajeGrasa}%</p>}
                  {p.medidasCorporales?.pecho && <p><strong>Pecho:</strong> {p.medidasCorporales.pecho} cm</p>}
                  {p.medidasCorporales?.cintura && <p><strong>Cintura:</strong> {p.medidasCorporales.cintura} cm</p>}
                  {p.medidasCorporales?.brazos && <p><strong>Brazos:</strong> {p.medidasCorporales.brazos} cm</p>}
                </div>
                {p.observaciones && <p className="text-sm text-blue-700 mt-2"><em>"{p.observaciones}"</em></p>}
              </div>
            )) : <p className="text-blue-900 text-center font-medium">No hay registros de progreso todavía. ¡Añade uno para empezar!</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
