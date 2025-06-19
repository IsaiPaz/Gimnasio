/*
 * Ahora puede obtener todas las rutinas o filtrarlas por entrenador.
 */
import pool from '../lib/database';
import { Rutina } from '../models/Rutina';

export class RepositorioRutina {
    /**
     * Obtiene todas las rutinas disponibles en el sistema.
     */
    public async obtenerTodas(): Promise<Rutina[]> {
        const sql = "SELECT * FROM rutinas ORDER BY dificultad, nombre";
        const [rows]: any[] = await pool.execute(sql);
        return rows.map((row: any) => new Rutina(
            row.idRutina,
            row.nombre,
            row.descripcion,
            row.dificultad,
            row.duracionSemanas
        ));
    }

    /**
     * Obtiene solo las rutinas asociadas a un entrenador específico.
     * @param entrenadorId - El ID del usuario del entrenador.
     */
    public async obtenerPorEntrenadorId(entrenadorId: string): Promise<Rutina[]> {
        const sql = `
            SELECT r.* FROM rutinas r
            JOIN entrenador_rutinas er ON r.idRutina = er.rutinaId
            WHERE er.entrenadorId = ?
            ORDER BY r.dificultad, r.nombre
        `;
        const [rows]: any[] = await pool.execute(sql, [entrenadorId]);
        return rows.map((row: any) => new Rutina(
            row.idRutina,
            row.nombre,
            row.descripcion,
            row.dificultad,
            row.duracionSemanas
        ));
    }
}