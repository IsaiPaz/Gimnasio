/*
 * Maneja la lógica de negocio para el registro de asistencia a clases.
 */
import { RepositorioMiembro } from '../repositories/RepositorioMiembro';
import { RepositorioInscripcion } from '../repositories/RepositorioInscripcion';
import { RepositorioAsistencia } from '../repositories/RepositorioAsistencia';
import { Asistencia } from '../models/Asistencia';

export class GestorAsistencia {
  private repoMiembro: RepositorioMiembro;
  private repoInscripcion: RepositorioInscripcion;
  private repoAsistencia: RepositorioAsistencia;

  constructor() {
    this.repoMiembro = new RepositorioMiembro();
    this.repoInscripcion = new RepositorioInscripcion();
    this.repoAsistencia = new RepositorioAsistencia();
  }

  /**
   * Procesa la solicitud de registro de asistencia de un miembro a una clase.
   * @param miembroId - El ID del miembro que intenta registrar asistencia.
   * @param claseId - El ID de la clase a la que asiste.
   * @returns {Promise<Asistencia>} La instancia de la asistencia creada.
   * @throws {Error} Si no se cumplen las validaciones.
   */
  public async registrarAsistencia(miembroId: string, claseId: string): Promise<Asistencia> {
    // 1. Validar que el miembro exista y su membresía esté activa.
    const miembro = await this.repoMiembro.buscarPorId(miembroId);
    if (!miembro) {
        throw new Error("Acceso Denegado: Miembro no encontrado.");
    }
    if (miembro.estadoMembresia !== 'Activa') {
        throw new Error(`Acceso Denegado: La membresía se encuentra en estado '${miembro.estadoMembresia}'.`);
    }

    // 2. Validar que el miembro esté inscrito en la clase.
    const estaInscrito = await this.repoInscripcion.verificarInscripcion(miembroId, claseId);
    if (!estaInscrito) {
        throw new Error("Acceso Denegado: No estás inscrito en esta clase.");
    }
    
    // 3. Si todas las validaciones pasan, se crea el registro de asistencia.
    const nuevaAsistencia = new Asistencia(
        '', // El ID se genera en el repositorio
        miembroId,
        claseId,
        new Date()
    );

    try {
      const asistenciaGuardada = await this.repoAsistencia.crear(nuevaAsistencia);
      return asistenciaGuardada;
    } catch (error) {
      console.error("Error en GestorAsistencia al registrar:", error);
      throw new Error("No se pudo registrar la asistencia.");
    }
  }
}
