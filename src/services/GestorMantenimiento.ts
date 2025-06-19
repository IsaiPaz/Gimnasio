import { RepositorioEquipo } from '../repositories/RepositorioEquipo';
import { RepositorioNotificacion } from '../repositories/RepositorioNotificacion';
import { NotificacionMantenimiento } from '../models/NotificacionMantenimiento';
import { Equipo } from '../models/Equipo';
import pool from '../lib/database';

export class GestorMantenimiento {
  private repoEquipo: RepositorioEquipo;
  private repoNotificacion: RepositorioNotificacion;

  constructor() {
    this.repoEquipo = new RepositorioEquipo();
    this.repoNotificacion = new RepositorioNotificacion();
  }

  public async reportarFalla(idEquipo: string, miembroId: string, descripcionFalla: string): Promise<NotificacionMantenimiento> {
    const connection = await pool.getConnection(); // Obtenemos una única conexión para la transacción
    try {
        await connection.beginTransaction(); // Iniciamos la transacción

        // Pasamos la 'connection' a los métodos del repositorio.
        await this.repoEquipo.cambiarEstado(idEquipo, 'Dañado', connection);
        
        const nuevaNotificacion = new NotificacionMantenimiento(
            '',
            idEquipo,
            miembroId,
            descripcionFalla,
            new Date(),
            'Abierta'
        );

        // Pasamos la 'connection' al método de creación de notificación.
        const notificacionGuardada = await this.repoNotificacion.crear(nuevaNotificacion, connection);

        await connection.commit(); // Si todo sale bien, confirmamos los cambios
        return notificacionGuardada;

    } catch (error: any) {
        await connection.rollback(); // Si algo falla, se revierten AMBAS operaciones
        console.error("Error en la transacción de reporte de falla:", error);
        throw new Error("No se pudo completar el reporte de la falla.");
    } finally {
        connection.release(); // Liberamos la conexión de vuelta al pool
    }
  }

  public async gestionarEstadoEquipo(idAdmin: string, idEquipo: string, nuevoEstado: Equipo['estado']): Promise<void> {
      // Aquí se podría añadir lógica de negocio, como registrar quién hizo el cambio,
      // notificar al proveedor, etc. Por ahora, es una acción directa.
      console.log(`Admin ${idAdmin} cambiando estado de equipo ${idEquipo} a ${nuevoEstado}`);
      await this.repoEquipo.cambiarEstado(idEquipo, nuevoEstado);
  }
  
}
