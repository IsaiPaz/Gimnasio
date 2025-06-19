import { NotificacionMantenimiento } from '../models/NotificacionMantenimiento';
import { v4 as uuidv4 } from 'uuid';
import pool from '../lib/database';

export class RepositorioNotificacion {
    // ... (método crear existente)
    public async crear(notificacion: NotificacionMantenimiento, connection?: any): Promise<NotificacionMantenimiento> {
        const nuevoId = uuidv4();
        notificacion.idNotificacion = nuevoId;
        const sql = `
            INSERT INTO notificaciones_mantenimiento 
            (idNotificacion, fechaReporte, descripcionFalla, estadoNotificacion, idEquipo, idMiembroReporta, idAdminGestiona) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const executor = connection || pool;
        await executor.execute(sql, [
            nuevoId, notificacion.fechaReporte, notificacion.descripcionFalla,
            notificacion.estadoNotificacion, notificacion.idEquipo, notificacion.idMiembroReporta,
            notificacion.idAdminGestiona || null,
        ]);
        return notificacion;
    }

    /**
     * Obtiene todas las notificaciones que no están cerradas, con detalles del equipo y miembro.
     */
    public async obtenerAbiertasDetallado(): Promise<any[]> {
        const sql = `
            SELECT 
                n.idNotificacion, n.fechaReporte, n.descripcionFalla, n.estadoNotificacion,
                e.idEquipo, e.nombre as nombreEquipo, e.estado as estadoEquipo,
                u.nombreCompleto as nombreMiembro
            FROM notificaciones_mantenimiento n
            JOIN equipos e ON n.idEquipo = e.idEquipo
            JOIN usuarios u ON n.idMiembroReporta = u.idUsuario
            WHERE n.estadoNotificacion != 'Cerrada'
            ORDER BY n.fechaReporte DESC
        `;
        const [rows]: any[] = await pool.execute(sql);
        return rows;
    }
}

