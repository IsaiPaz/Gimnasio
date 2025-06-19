import { NextResponse } from 'next/server';
import { GestorMantenimiento } from '../../../services/GestorMantenimiento';

export async function POST(request: Request) {
    try {
        const { idEquipo, miembroId, descripcionFalla } = await request.json();
        if (!idEquipo || !miembroId || !descripcionFalla) {
            return NextResponse.json({ message: "Datos incompletos." }, { status: 400 });
        }
        
        const gestor = new GestorMantenimiento();
        const nuevaNotificacion = await gestor.reportarFalla(idEquipo, miembroId, descripcionFalla);

        return NextResponse.json({ message: "Falla reportada exitosamente. Un administrador revisará el caso.", data: nuevaNotificacion }, { status: 201 });

    } catch (error: any) {
        console.error("Error en endpoint de reporte de falla:", error);
        return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
    }
}
