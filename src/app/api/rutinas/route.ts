/*
 * El endpoint ahora acepta un parámetro de consulta `entrenadorId`.
 */
import { NextResponse } from 'next/server';
import { RepositorioRutina } from '../../../repositories/RepositorioRutina';
import type { Rutina } from '../../../models/Rutina';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const entrenadorId = searchParams.get('entrenadorId');
        
        const repo = new RepositorioRutina();
        let rutinas: Rutina[];

        if (entrenadorId) {
            // Si se proporciona un ID de entrenador, filtramos las rutinas.
            rutinas = await repo.obtenerPorEntrenadorId(entrenadorId);
        } else {
            // Si no, devolvemos todas las rutinas.
            rutinas = await repo.obtenerTodas();
        }
        
        return NextResponse.json(rutinas);

    } catch (error) {
        console.error("Error al obtener rutinas:", error);
        return NextResponse.json({ message: "Error interno al obtener rutinas" }, { status: 500 });
    }
}
