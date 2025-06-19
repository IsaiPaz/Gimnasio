import { Usuario } from "./Usuario";

export class Entrenador extends Usuario {
  constructor(
    // Hereda de Usuario
    idUsuario: string,
    nombreCompleto: string,
    correoElectronico: string,
    telefono: string,
    fechaNacimiento: Date,
    contrasena: string,
    // Propiedades propias
    public especialidad: string,
    public aniosExperiencia?: number,
    public certificaciones?: string[]
  ) {
    super(idUsuario, nombreCompleto, correoElectronico, telefono, fechaNacimiento, contrasena);
  }
}