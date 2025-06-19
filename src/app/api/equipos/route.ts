/*
 * Endpoint para obtener la lista de equipos operativos.
 */
import { NextResponse } from 'next/server';
import { RepositorioEquipo } from '../../../repositories/RepositorioEquipo';

export async function GET() {
    try {
        const repo = new RepositorioEquipo();
        // Filtramos para que los miembros solo puedan reportar equipos que están 'Operativo'
        const equipos = (await repo.obtenerTodos()).filter(e => e.estado === 'Operativo');
        return NextResponse.json(equipos);
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener equipos" }, { status: 500 });
    }
}
