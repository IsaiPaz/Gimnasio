/*
 * Endpoint para registrar la asistencia a una clase.
 */
import { NextResponse } from 'next/server';
import { GestorAsistencia } from '../../../services/GestorAsistencia';

export async function POST(request: Request) {
  try {
    const { miembroId, claseId } = await request.json();

    if (!miembroId || !claseId) {
      return NextResponse.json(
        { message: "Datos incompletos. Se requiere miembroId y claseId." },
        { status: 400 }
      );
    }
    
    const gestor = new GestorAsistencia();
    const nuevaAsistencia = await gestor.registrarAsistencia(miembroId, claseId);
    
    return NextResponse.json(
        { message: "Asistencia registrada exitosamente.", data: nuevaAsistencia },
        { status: 201 }
    );

  } catch (error: any) {
    // Manejar errores de validación específicos lanzados por el gestor
    if (error.message.startsWith("Acceso Denegado:")) {
        return NextResponse.json({ message: error.message }, { status: 403 }); // 403 Forbidden
    }

    console.error("Error en el endpoint de asistencia:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
