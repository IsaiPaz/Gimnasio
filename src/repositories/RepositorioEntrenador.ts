import pool from '../lib/database';
import { Entrenador } from '../models/Entrenador';

export class RepositorioEntrenador {
  public async obtenerTodos(): Promise<Entrenador[]> {
    const sql = `
      SELECT u.*, e.especialidad, e.aniosExperiencia, e.certificaciones
      FROM usuarios u
      JOIN entrenadores e ON u.idUsuario = e.usuarioId
      ORDER BY u.nombreCompleto
    `;
    const [rows]: any[] = await pool.execute(sql);
    return rows.map((row: any) => new Entrenador(
        row.idUsuario,
        row.nombreCompleto,
        row.correoElectronico,
        row.telefono,
        row.fechaNacimiento,
        row.contrasena,
        row.especialidad,
        row.aniosExperiencia,
        row.certificaciones?.split(',')
    ));
  }
}