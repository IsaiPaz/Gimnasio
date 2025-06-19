import { v4 as uuidv4 } from 'uuid';
import { AsignacionEntrenador } from '../models/AsignacionEntrenador';
import pool from '../lib/database'; 

export class RepositorioAsignacion {
    public async crear(asignacion: AsignacionEntrenador): Promise<AsignacionEntrenador> {
        const nuevoId = uuidv4();
        asignacion.idAsignacion = nuevoId;
        const sql = "INSERT INTO asignaciones (idAsignacion, miembroId, entrenadorId, rutinaId, fechaAsignacion) VALUES (?, ?, ?, ?, ?)";
        await pool.execute(sql, [
            nuevoId,
            asignacion.miembroId,
            asignacion.entrenadorId,
            asignacion.rutinaId,
            asignacion.fechaAsignacion
        ]);
        return asignacion;
    }
}