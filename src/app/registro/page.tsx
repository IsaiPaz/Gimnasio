"use client"; // Directiva necesaria para componentes de cliente en Next.js App Router

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Componente de página para que la recepcionista registre un nuevo miembro.
 * Contiene el formulario y la lógica para interactuar con la API.
 */
export default function RegistroMiembroPage() {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    telefono: '',
    fechaNacimiento: '',
    contrasena: '',
    tipoMembresia: 'Básica',
  });

  // Estado para manejar los mensajes de respuesta (éxito o error)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  /**
   * Maneja el cambio en los campos del formulario.
   * @param e - Evento del cambio en el input o select.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * Maneja el envío del formulario.
   * @param e - Evento de envío del formulario.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/miembros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Si la respuesta no es exitosa, es un error
        throw new Error(result.message || 'Ocurrió un error en el servidor.');
      }

      // Si la respuesta es exitosa
      setMessage({ type: 'success', text: result.message });
      // Limpiar el formulario después del éxito
      setFormData({
        nombreCompleto: '',
        correoElectronico: '',
        telefono: '',
        fechaNacimiento: '',
        contrasena: '',
        tipoMembresia: 'Básica',
      });

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl border border-blue-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-lg text-center tracking-tight flex-1">
            Registro de Nuevo Miembro
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="ml-4 px-5 py-2 rounded-lg bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition"
            title="Regresar al Dashboard"
          >
            ←
          </button>
        </div>
        <p className="text-blue-700 mb-6 text-center font-medium">Interfaz para el personal de recepción.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fila de Nombre Completo y Correo Electrónico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombreCompleto" className="block text-base font-semibold text-blue-900 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="correoElectronico" className="block text-base font-semibold text-blue-900 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                required
              />
            </div>
          </div>
          
          {/* Fila de Teléfono y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="telefono" className="block text-base font-semibold text-blue-900 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label htmlFor="fechaNacimiento" className="block text-base font-semibold text-blue-900 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              />
            </div>
          </div>

          {/* Fila de Contraseña y Tipo de Membresía */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contrasena" className="block text-base font-semibold text-blue-900 mb-1">
                Contraseña Temporal
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-blue-300 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="tipoMembresia" className="block text-base font-semibold text-blue-900 mb-1">
                Tipo de Membresía
              </label>
              <select
                id="tipoMembresia"
                name="tipoMembresia"
                value={formData.tipoMembresia}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
              >
                <option>Básica</option>
                <option>Premium</option>
                <option>VIP</option>
              </select>
            </div>
          </div>

          {/* Botón de envío y mensajes de estado */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition"
            >
              {isLoading ? 'Registrando...' : 'Registrar Miembro'}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-md text-base font-semibold text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
