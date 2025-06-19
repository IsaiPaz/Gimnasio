import { RepositorioMiembro } from '../repositories/RepositorioMiembro';
import { RepositorioAsignacion } from '../repositories/RepositorioAsignacion';
import { AsignacionEntrenador } from '../models/AsignacionEntrenador';

export class GestorAsignacion {
  private repoMiembro: RepositorioMiembro;
  private repoAsignacion: RepositorioAsignacion;

  constructor() {
    this.repoMiembro = new RepositorioMiembro();
    this.repoAsignacion = new RepositorioAsignacion();
  }

  /**
   * Procesa la solicitud de asignación de un entrenador y rutina a un miembro.
   */
  public async crearAsignacion(miembroId: string, entrenadorId: string, rutinaId: string): Promise<AsignacionEntrenador> {
    // 1. Validar que el miembro tenga una membresía activa.
    const miembro = await this.repoMiembro.buscarPorId(miembroId);
    if (!miembro || miembro.estadoMembresia !== 'Activa') {
      throw new Error("Asignación fallida: La membresía del miembro no está activa.");
    }

    // 2. Crear la nueva asignación.
    const nuevaAsignacion = new AsignacionEntrenador(
      '', // El ID se genera en el repositorio
      miembroId,
      entrenadorId,
      rutinaId,
      new Date()
    );

    try {
      // La base de datos lanzará un error si el miembro ya tiene una asignación,
      // gracias a la restricción UNIQUE KEY.
      const asignacionGuardada = await this.repoAsignacion.crear(nuevaAsignacion);
      return asignacionGuardada;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
          throw new Error("Asignación fallida: Este miembro ya tiene un entrenador asignado.");
      }
      console.error("Error en GestorAsignacion al crear asignación:", error);
      throw new Error("No se pudo completar la asignación.");
    }
  }
}