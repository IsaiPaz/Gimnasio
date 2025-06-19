"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserSession {
  idUsuario: string;
  nombreCompleto: string;
  rol: 'miembro' | 'administrador' | 'recepcionista';
}

// --- Componentes de Iconos SVG para la UI ---
const UserPlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> );
const ClipboardListIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> );
const ChartBarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> );
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const UserGroupIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> );
const WrenchScrewdriverIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.964 2.964a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-1.06 1.06-4.244-4.243L15.964 2.964zM6 12v-2a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6m-6 4v2a2 2 0 002 2h4a2 2 0 002-2v-2m-6 0h6" /></svg> );
const BellAlertIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );

export default function DashboardPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('session');
    router.push('/login');
  };

  if (!session) {
    return <main className="flex min-h-screen items-center justify-center"><p>Cargando...</p></main>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Principal</h1>
            <p className="text-gray-600">Bienvenido, {session.nombreCompleto} ({session.rol})</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Opciones para Miembros */}
            {session.rol === 'miembro' && (
              <>
                <NavigationCard href="/inscripciones" icon={<ClipboardListIcon />} title="Inscribirse a Clases" description="Ver clases disponibles y gestionar tus inscripciones." />
                <NavigationCard href="/progreso" icon={<ChartBarIcon />} title="Mi Progreso Físico" description="Registra y visualiza tu evolución y metas." />
                <NavigationCard href="/asistencia" icon={<CheckCircleIcon />} title="Registrar Asistencia" description="Confirma tu asistencia a la clase de hoy." />
                <NavigationCard href="/asignacion" icon={<UserGroupIcon />} title="Asignar Entrenador" description="Solicita un entrenador personal y elige tu rutina." />
                <NavigationCard href="/reportar-falla" icon={<WrenchScrewdriverIcon />} title="Reportar Falla de Equipo" description="Notifica al personal sobre equipo que necesita mantenimiento." />
              </>
            )}

            {/* Opciones para Recepcionistas */}
            {session.rol === 'recepcionista' && (
              <>
                <NavigationCard href="/registro" icon={<UserPlusIcon />} title="Registrar Nuevo Miembro" description="Dar de alta a nuevos clientes en el sistema." />
                {/* Futuras opciones para recepcionista irían aquí */}
              </>
            )}

            {/* Opciones para Administradores */}
            {session.rol === 'administrador' && (
              <>
                 <NavigationCard href="/registro" icon={<UserPlusIcon />} title="Registrar Usuarios" description="Dar de alta a miembros, recepcionistas y entrenadores." />
                 <NavigationCard href="/admin/mantenimiento" icon={<BellAlertIcon />} title="Gestionar Mantenimiento" description="Revisar reportes de fallas y gestionar estado de equipos." />
                 {/* Futuras opciones para administrador irían aquí */}
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

// Componente reutilizable para las tarjetas de navegación
const NavigationCard = ({ href, icon, title, description }: { href: string, icon: React.ReactNode, title: string, description: string }) => (
    <Link href={href} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group">
        <div className="flex items-center">
            {icon}
            <h3 className="ml-4 text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{title}</h3>
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
    </Link>
);
