/*
 * Orquesta la lógica de negocio para el registro de miembros.
 */
import { RepositorioUsuario } from '../repositories/RepositorioUsuario';
import { RepositorioMiembro } from '../repositories/RepositorioMiembro';
import { Miembro } from '../models/Miembro';

export class GestorMiembro {
  private repoUsuario: RepositorioUsuario;
  private repoMiembro: RepositorioMiembro;

  constructor() {
    this.repoUsuario = new RepositorioUsuario();
    this.repoMiembro = new RepositorioMiembro();
  }

  /**
   * Procesa la solicitud de registro de un nuevo miembro.
   * @param datosMiembro - Los datos del miembro a registrar.
   * @returns {Promise<Miembro>} La instancia del miembro creado.
   * @throws {Error} Si el usuario ya existe o si hay un error en la creación.
   */
  public async registrarNuevoMiembro(datosMiembro: any): Promise<Miembro> {
    // Regla de negocio: Verificar si el usuario ya existe (Flujo alternativo)
    const yaExiste = await this.repoUsuario.verificarUnicidad(datosMiembro.correoElectronico);
    if (yaExiste) {
      throw new Error("UsuarioExistente: El correo electrónico ya está registrado en el sistema.");
    }

    // Flujo principal: Crear el nuevo miembro
    try {
      const nuevoMiembro = await this.repoMiembro.crear(datosMiembro);
      // Aquí se podría activar la membresía, enviar un email de bienvenida, etc.
      console.log(`Miembro ${nuevoMiembro.getNombreCompleto()} registrado exitosamente.`);
      return nuevoMiembro;
    } catch (error) {
      console.error("Error en GestorMiembro al registrar:", error);
      // Re-lanzamos el error para que la capa superior (API) lo maneje.
      throw error;
    }
  }
}
