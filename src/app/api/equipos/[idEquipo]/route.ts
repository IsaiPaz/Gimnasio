/*
 * Endpoint para que el admin actualice el estado de un equipo.
 */
import { GestorMantenimiento } from '../../../../services/GestorMantenimiento';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { idEquipo: string } }) {
    try {
        const { idEquipo } = params;
        const { nuevoEstado, idAdmin } = await request.json();

        if (!nuevoEstado || !idAdmin) {
            return NextResponse.json({ message: "Datos incompletos. Se requiere nuevoEstado y idAdmin." }, { status: 400 });
        }
        
        const gestor = new GestorMantenimiento();
        await gestor.gestionarEstadoEquipo(idAdmin, idEquipo, nuevoEstado);

        return NextResponse.json({ message: "Estado del equipo actualizado correctamente." });

    } catch (error) {
        console.error("Error al actualizar estado del equipo:", error);
        return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
    }
}