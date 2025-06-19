/*
 * Endpoint para que el admin obtenga las notificaciones.
 */
import { NextResponse } from 'next/server';
import { RepositorioNotificacion } from '../../../../repositories/RepositorioNotificacion';

export async function GET() {
    try {
        const repo = new RepositorioNotificacion();
        const notificaciones = await repo.obtenerAbiertasDetallado();
        return NextResponse.json(notificaciones);
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener notificaciones" }, { status: 500 });
    }
}
