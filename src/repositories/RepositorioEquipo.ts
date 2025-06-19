import pool from '../lib/database';
import { Equipo } from '../models/Equipo';

export class RepositorioEquipo {
    public async obtenerTodos(): Promise<Equipo[]> {
        const [rows]: any[] = await pool.execute("SELECT * FROM equipos WHERE estado != 'De Baja' ORDER BY nombre");
        return rows.map((row: any) => new Equipo(row.idEquipo, row.nombre, row.idSucursal, row.estado, row.marca, row.idProveedor));
    }

    /**
     * @param connection - Una conexión de base de datos opcional para usar en una transacción.
     */
    public async cambiarEstado(idEquipo: string, nuevoEstado: Equipo['estado'], connection?: any): Promise<void> {
        // Si se proporciona una conexión, la usamos. Si no, usamos el pool.
        const executor = connection || pool;
        await executor.execute("UPDATE equipos SET estado = ? WHERE idEquipo = ?", [nuevoEstado, idEquipo]);
    }
}