import { RepositorioProgresoFisico } from '../repositories/RepositorioProgresoFisico';
import { ProgresoFisico } from '../models/ProgresoFisico';
import { RepositorioMiembro } from '../repositories/RepositorioMiembro';

export class GestorProgresoFisico {
  private repoProgreso: RepositorioProgresoFisico;
  private repoMiembro: RepositorioMiembro;

  constructor() {
    this.repoProgreso = new RepositorioProgresoFisico();
    this.repoMiembro = new RepositorioMiembro();
  }

  public async registrarProgreso(datos: any): Promise<ProgresoFisico> {
    // --- LÓGICA DE VALIDACIÓN MEJORADA ---
    const miembro = await this.repoMiembro.buscarPorId(datos.miembroId);

    if (!miembro) {
        throw new Error("Acceso Denegado: El miembro con el ID proporcionado no fue encontrado.");
    }

    if (miembro.estadoMembresia !== 'Activa') {
        throw new Error(`Acceso Denegado: La membresía no está activa (estado actual: ${miembro.estadoMembresia}).`);
    }
    // --- FIN DE LA MEJORA ---
    
    const nuevoProgreso = new ProgresoFisico(
      '',
      datos.miembroId,
      new Date(),
      datos.peso,
      datos.medidasCorporales,
      datos.porcentajeGrasa,
      datos.observaciones
    );

    try {
      const progresoGuardado = await this.repoProgreso.crear(nuevoProgreso);
      return progresoGuardado;
    } catch (error) {
      console.error("Error en GestorProgresoFisico al registrar:", error);
      throw new Error("No se pudo registrar el progreso en la base de datos.");
    }
  }

  public async obtenerHistorial(miembroId: string): Promise<ProgresoFisico[]> {
      return this.repoProgreso.obtenerPorMiembroId(miembroId);
  }
}
