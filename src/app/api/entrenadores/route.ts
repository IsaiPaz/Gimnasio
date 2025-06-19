/*
 * Endpoint para obtener la lista de todos los entrenadores.
 */
import { NextResponse } from 'next/server';
import { RepositorioEntrenador } from '../../../repositories/RepositorioEntrenador';

export async function GET() {
    try {
        const repo = new RepositorioEntrenador();
        const entrenadores = await repo.obtenerTodos();
        return NextResponse.json(entrenadores);
    } catch (error) {
        console.error("Error al obtener entrenadores:", error);
        return NextResponse.json({ message: "Error interno al obtener entrenadores" }, { status: 500 });
    }
}