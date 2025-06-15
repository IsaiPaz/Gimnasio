import { v4 as uuidv4 } from 'uuid';
import { Inscripcion } from '../models/Inscripcion';
import  pool  from '../lib/database'; 

export class RepositorioInscripcion {
  /**
   * Verifica si un miembro ya está inscrito en una clase.
   */
  public async verificarInscripcion(miembroId: string, claseId: string): Promise<boolean> {
    const sql = "SELECT 1 FROM inscripciones WHERE miembroId = ? AND claseId = ? LIMIT 1";
    const [rows]: any[] = await pool.execute(sql, [miembroId, claseId]);
    return rows.length > 0;
  }

  /**
   * Crea un nuevo registro de inscripción y actualiza el conteo en la clase.
   */
  public async crear(miembroId: string, claseId: string): Promise<Inscripcion> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Crear la inscripción
      const idInscripcion = uuidv4();
      const fecha = new Date();
      const sqlInscripcion = "INSERT INTO inscripciones (idInscripcion, miembroId, claseId, fechaInscripcion) VALUES (?, ?, ?, ?)";
      await connection.execute(sqlInscripcion, [idInscripcion, miembroId, claseId, fecha]);

      // 2. Actualizar el contador de inscritos en la clase
      const sqlUpdateClase = "UPDATE clases SET inscritos = inscritos + 1 WHERE idClase = ?";
      await connection.execute(sqlUpdateClase, [claseId]);

      await connection.commit();

      return new Inscripcion(idInscripcion, miembroId, claseId, fecha);

    } catch (error) {
      await connection.rollback();
      console.error("Error en la transacción de inscripción:", error);
      // El error de 'Duplicate entry' será capturado aquí si el índice único falla.
      throw new Error("No se pudo completar la inscripción.");
    } finally {
      connection.release();
    }
  }
}
