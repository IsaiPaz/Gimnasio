export class Inscripcion {
  constructor(
    public idInscripcion: string,
    public miembroId: string,
    public claseId: string,
    public fechaInscripcion: Date
  ) {}
}