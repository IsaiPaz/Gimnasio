/*
 * Endpoint para crear una nueva asignación.
 */

import { NextResponse } from 'next/server'; // Re-usado de arriba
import { GestorAsignacion } from '../../../services/GestorAsignacion';

export async function POST(request: Request) {
    try {
        const { miembroId, entrenadorId, rutinaId } = await request.json();
        if (!miembroId || !entrenadorId || !rutinaId) {
            return NextResponse.json({ message: "Datos incompletos." }, { status: 400 });
        }
        
        const gestor = new GestorAsignacion();
        const nuevaAsignacion = await gestor.crearAsignacion(miembroId, entrenadorId, rutinaId);

        return NextResponse.json({ message: "Asignación creada exitosamente.", data: nuevaAsignacion }, { status: 201 });

    } catch (error: any) {
        if (error.message.startsWith("Asignación fallida:")) {
            return NextResponse.json({ message: error.message }, { status: 409 }); // Conflict
        }
        console.error("Error en endpoint de asignaciones:", error);
        return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
    }
}
