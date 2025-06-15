import pool from '../lib/database';
import { v4 as uuidv4 } from 'uuid';
import { ProgresoFisico } from '../models/ProgresoFisico';

export class RepositorioProgresoFisico {
  /**
   * Crea un nuevo registro de progreso físico en la base de datos.
   * @param progreso - Una instancia de la clase ProgresoFisico.
   * @returns {Promise<ProgresoFisico>} La instancia guardada.
   */
  public async crear(progreso: ProgresoFisico): Promise<ProgresoFisico> {
    const nuevoId = uuidv4();
    progreso.idProgreso = nuevoId;

    const sql = `
      INSERT INTO progresos_fisicos (idProgreso, miembroId, fechaRegistro, peso, medidasCorporales, porcentajeGrasa, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Convertimos el objeto de medidas a un string JSON para guardarlo
    const medidasJson = progreso.medidasCorporales ? JSON.stringify(progreso.medidasCorporales) : null;

    await pool.execute(sql, [
      nuevoId,
      progreso.miembroId,
      progreso.fechaRegistro,
      progreso.peso,
      medidasJson,
      progreso.porcentajeGrasa,
      progreso.observaciones
    ]);

    return progreso;
  }

  /**
   * Obtiene todos los registros de progreso para un miembro específico, ordenados por fecha.
   * @param miembroId - El ID del miembro.
   * @returns {Promise<ProgresoFisico[]>} Un arreglo de instancias de ProgresoFisico.
   */
  public async obtenerPorMiembroId(miembroId: string): Promise<ProgresoFisico[]> {
    const sql = "SELECT * FROM progresos_fisicos WHERE miembroId = ? ORDER BY fechaRegistro DESC";
    const [rows]: any[] = await pool.execute(sql, [miembroId]);

    return rows.map((row: any) => new ProgresoFisico(
      row.idProgreso,
      row.miembroId,
      row.fechaRegistro,
      row.peso,
      row.medidasCorporales ? JSON.parse(row.medidasCorporales) : undefined, // Convertimos de JSON a objeto
      row.porcentajeGrasa,
      row.observaciones
    ));
  }
}
