import pool from '../lib/database';

export class RepositorioUsuario {
  /**
   * Verifica si ya existe un usuario con un correo electrónico específico.
   * @param email - El correo electrónico a verificar.
   * @returns {Promise<boolean>} True si el usuario existe, false en caso contrario.
   */
  public async verificarUnicidad(email: string): Promise<boolean> {
    const sql = "SELECT 1 FROM usuarios WHERE correoElectronico = ? LIMIT 1";
    const [rows]: any[] = await pool.execute(sql, [email]);
    return rows.length > 0;
  }

  /**
   * Busca un usuario por su email y determina su rol haciendo JOIN con las tablas de roles.
   * @param email - El correo electrónico del usuario a buscar.
   * @returns El objeto del usuario con su rol, o null si no se encuentra.
   */
  public async buscarPorEmailConRol(email: string): Promise<any | null> {
    const sql = `
      SELECT 
        u.idUsuario,
        u.nombreCompleto,
        u.correoElectronico,
        u.contrasena,
        CASE
          WHEN m.usuarioId IS NOT NULL THEN 'miembro'
          WHEN a.usuarioId IS NOT NULL THEN 'administrador'
          WHEN r.usuarioId IS NOT NULL THEN 'recepcionista'
          ELSE 'desconocido'
        END as rol
      FROM usuarios u
      LEFT JOIN miembros m ON u.idUsuario = m.usuarioId
      LEFT JOIN administradores a ON u.idUsuario = a.usuarioId
      LEFT JOIN recepcionistas r ON u.idUsuario = r.usuarioId
      WHERE u.correoElectronico = ?
    `;

    const [rows]: any[] = await pool.execute(sql, [email]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }
}