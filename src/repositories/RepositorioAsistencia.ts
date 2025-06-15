/*
 * Responsable de las operaciones de la entidad Asistencia en la base de datos.
 */
import pool from '../lib/database';
import { v4 as uuidv4 } from 'uuid';
import { Asistencia } from '../models/Asistencia'; // Ajusta la ruta según la ubicación real del archivo Asistencia

export class RepositorioAsistencia {
  /**
   * Crea un nuevo registro de asistencia en la base de datos.
   * @param asistencia - Una instancia de la clase Asistencia.
   * @returns {Promise<Asistencia>} La instancia guardada.
   */
  public async crear(asistencia: Asistencia): Promise<Asistencia> {
    const nuevoId = uuidv4();
    asistencia.idAsistencia = nuevoId;

    const sql = `
      INSERT INTO asistencias (idAsistencia, miembroId, claseId, fechaHora)
      VALUES (?, ?, ?, ?)
    `;
    
    await pool.execute(sql, [
      nuevoId,
      asistencia.miembroId,
      asistencia.claseId,
      asistencia.fechaHora,
    ]);

    return asistencia;
  }
}
