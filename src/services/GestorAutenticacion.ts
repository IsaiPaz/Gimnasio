import { RepositorioUsuario } from '../repositories/RepositorioUsuario';

export class GestorAutenticacion {
  private repoUsuario: RepositorioUsuario;

  constructor() {
    this.repoUsuario = new RepositorioUsuario();
  }

  public async iniciarSesion(email: string, contrasena: string): Promise<any> {
    const usuario = await this.repoUsuario.buscarPorEmailConRol(email);

    if (!usuario) {
      throw new Error("Credenciales inválidas: Usuario no encontrado.");
    }
    
    // Comparación directa. En una app real, usar: await bcrypt.compare(contrasena, usuario.contrasena)
    if (usuario.contrasena !== contrasena) {
      throw new Error("Credenciales inválidas: Contraseña incorrecta.");
    }
    
    // Quitamos la contraseña del objeto que se devuelve al frontend
    const { contrasena: _, ...usuarioSinContrasena } = usuario;
    return usuarioSinContrasena;
  }
}
