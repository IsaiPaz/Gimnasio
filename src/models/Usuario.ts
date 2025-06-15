/**
 * Clase base abstracta que define las propiedades y métodos comunes
 * para todos los usuarios del sistema, según el diagrama de clases.
 */
export abstract class Usuario {
  protected idUsuario: string;
  protected nombreCompleto: string;
  protected correoElectronico: string;
  protected telefono: string;
  protected fechaNacimiento: Date;
  private contrasena: string;

  constructor(
    idUsuario: string,
    nombreCompleto: string,
    correoElectronico: string,
    telefono: string,
    fechaNacimiento: Date,
    contrasena: string
  ) {
    this.idUsuario = idUsuario;
    this.nombreCompleto = nombreCompleto;
    this.correoElectronico = correoElectronico;
    this.telefono = telefono;
    this.fechaNacimiento = fechaNacimiento;
    this.contrasena = contrasena;
  }

  public iniciarSesion(): void {
    console.log(`Usuario ${this.nombreCompleto} ha iniciado sesión.`);
  }

  public cerrarSesion(): void {
    console.log(`Usuario ${this.nombreCompleto} ha cerrado sesión.`);
  }

  public actualizarPerfil(nuevosDatos: { nombreCompleto?: string; telefono?: string }): void {
    this.nombreCompleto = nuevosDatos.nombreCompleto ?? this.nombreCompleto;
    this.telefono = nuevosDatos.telefono ?? this.telefono;
    console.log(`Perfil de ${this.idUsuario} actualizado.`);
  }
}