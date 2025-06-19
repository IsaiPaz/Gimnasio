export class AsignacionEntrenador {
  constructor(
    public idAsignacion: string,
    public miembroId: string,
    public entrenadorId: string,
    public rutinaId: string,
    public fechaAsignacion: Date
  ) {}
}