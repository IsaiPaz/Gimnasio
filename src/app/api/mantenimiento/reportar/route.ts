import { NextResponse } from 'next/server';
import { GestorMantenimiento } from '../../../../services/GestorMantenimiento';

export async function POST(request: Request) {
    try {
        const { idEquipo, miembroId, descripcionFalla } = await request.json();
        
        // Validación de datos de entrada
        if (!idEquipo || !miembroId || !descripcionFalla) {
            return NextResponse.json({ message: "Datos incompletos. Se requiere seleccionar un equipo y describir la falla." }, { status: 400 });
        }
        
        const gestor = new GestorMantenimiento();
        const nuevaNotificacion = await gestor.reportarFalla(idEquipo, miembroId, descripcionFalla);

        return NextResponse.json(
            { message: "Falla reportada exitosamente. Un administrador revisará el caso.", data: nuevaNotificacion },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error en el endpoint de reporte de falla:", error);
        return NextResponse.json({ message: "Error interno del servidor al procesar el reporte." }, { status: 500 });
    }
}
