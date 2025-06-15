import pool from '../lib/database';
import { Clase } from '../models/Clase';

export class RepositorioClase {
  public async buscarPorId(id: string): Promise<Clase | null> {
    const [rows]: any[] = await pool.execute("SELECT * FROM clases WHERE idClase = ?", [id]);
    if (rows.length === 0) return null;
    const data = rows[0];
    return new Clase(data.idClase, data.nombre, data.horario, data.cupoMaximo, data.inscritos, data.descripcion);
  }

  public async obtenerTodas(): Promise<Clase[]> {
      const [rows]: any[] = await pool.execute("SELECT * FROM clases ORDER BY nombre");
      return rows.map((data: any) => new Clase(data.idClase, data.nombre, data.horario, data.cupoMaximo, data.inscritos, data.descripcion));
  }
}