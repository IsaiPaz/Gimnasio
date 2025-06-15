export class Clase {
  constructor(
    public idClase: string,
    public nombre: string,
    public horario: string,
    public cupoMaximo: number,
    public inscritos: number,
    public descripcion?: string
  ) {}

  public hayCupoDisponible(): boolean {
    return this.inscritos < this.cupoMaximo;
  }
}