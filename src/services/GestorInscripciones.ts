import { RepositorioClase } from '../repositories/RepositorioClase';
import { RepositorioInscripcion } from '../repositories/RepositorioInscripcion';

export class GestorInscripciones {
  private repoClase: RepositorioClase;
  private repoInscripcion: RepositorioInscripcion;

  constructor() {
    this.repoClase = new RepositorioClase();
    this.repoInscripcion = new RepositorioInscripcion();
  }

  /**
   * Procesa la inscripción de un miembro a una o varias clases.
   */
  public async inscribirMiembro(miembroId: string, idsClases: string[]) {
    const resultados = {
      exitosas: [] as string[],
      fallidas: [] as { idClase: string; error: string }[],
    };

    for (const idClase of idsClases) {
      try {
        const clase = await this.repoClase.buscarPorId(idClase);
        if (!clase) {
          throw new Error("La clase solicitada no existe.");
        }

        // Regla: ¿Ya está inscrito? (Flujo Alternativo)
        const yaInscrito = await this.repoInscripcion.verificarInscripcion(miembroId, idClase);
        if (yaInscrito) {
          throw new Error("Ya estás inscrito en esta clase.");
        }

        // Regla: ¿Hay cupo? (Flujo Alternativo)
        if (!clase.hayCupoDisponible()) {
          throw new Error("Esta clase ya no tiene cupos disponibles.");
        }

        // Flujo Principal: Crear la inscripción
        await this.repoInscripcion.crear(miembroId, idClase);
        resultados.exitosas.push(clase.nombre);

      } catch (error: any) {
        // En caso de error, obtenemos el nombre de la clase para un mensaje más claro.
        const claseFallida = await this.repoClase.buscarPorId(idClase);
        const nombreClase = claseFallida?.nombre || idClase;
        resultados.fallidas.push({ idClase: nombreClase, error: error.message });
      }
    }

    return resultados;
  }
}
