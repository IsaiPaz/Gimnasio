
import pool from '../lib/database';
import { Miembro } from '../models/Miembro';
import { v4 as uuidv4 } from 'uuid';

export class RepositorioMiembro {

  /**
   * Crea un nuevo Miembro y su Usuario asociado usando una transacción.
   * @param datos - Objeto con los datos del nuevo miembro.
   * @returns {Promise<Miembro>} Una instancia de la clase Miembro si la creación es exitosa.
   * @throws {Error} Si ocurre un problema durante la transacción.
   */
  public async crear(datos: any): Promise<Miembro> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const idUsuario = uuidv4();
      const contrasenaHasheada = datos.contrasena; // Placeholder for hashing

      const sqlUsuario = `
        INSERT INTO usuarios (idUsuario, nombreCompleto, correoElectronico, telefono, fechaNacimiento, contrasena)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(sqlUsuario, [
        idUsuario,
        datos.nombreCompleto,
        datos.correoElectronico,
        datos.telefono,
        new Date(datos.fechaNacimiento),
        contrasenaHasheada
      ]);

      const idMembresia = `memb_${uuidv4().substring(0, 8)}`;
      const sqlMiembro = `
        INSERT INTO miembros (id, idMembresia, tipoMembresia, estadoMembresia, usuarioId)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.execute(sqlMiembro, [
        uuidv4(),
        idMembresia,
        datos.tipoMembresia || 'Básica',
        "Activa",
        idUsuario
      ]);

      await connection.commit();

      return new Miembro(
        idUsuario,
        datos.nombreCompleto,
        datos.correoElectronico,
        datos.telefono,
        new Date(datos.fechaNacimiento),
        contrasenaHasheada,
        idMembresia,
        datos.tipoMembresia || 'Básica'
      );

    } catch (error) {
      await connection.rollback();
      console.error("Error en la transacción de creación de miembro:", error);
      throw new Error("No se pudo registrar al miembro. Por favor, inténtelo de nuevo.");
    } finally {
      connection.release();
    }
  }

  /**
   * (MÉTODO AÑADIDO)
   * Busca un miembro por su ID de usuario y devuelve una instancia de la clase Miembro.
   * @param idUsuario - El ID del usuario a buscar.
   * @returns Una instancia de Miembro o null si no se encuentra.
   */
  public async buscarPorId(idUsuario: string): Promise<Miembro | null> {
    const sql = `
      SELECT u.*, m.idMembresia, m.tipoMembresia, m.estadoMembresia
      FROM usuarios u
      JOIN miembros m ON u.idUsuario = m.usuarioId
      WHERE u.idUsuario = ?
    `;

    const [rows]: any[] = await pool.execute(sql, [idUsuario]);

    if (rows.length === 0) {
      return null;
    }

    const data = rows[0];

    // Mapeo (o "hidratación"): Convertimos el resultado plano de la DB a un objeto de nuestra clase.
    const miembro = new Miembro(
      data.idUsuario,
      data.nombreCompleto,
      data.correoElectronico,
      data.telefono,
      data.fechaNacimiento,
      data.contrasena,
      data.idMembresia,
      data.tipoMembresia
    );
    // Asignamos el estado actual que viene de la base de datos.
    miembro.estadoMembresia = data.estadoMembresia;

    return miembro;
  }
}
