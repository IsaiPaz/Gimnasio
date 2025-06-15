export class Asistencia {
  constructor(
    public idAsistencia: string,
    public miembroId: string,
    public claseId: string,
    public fechaHora: Date
  ) {}
}