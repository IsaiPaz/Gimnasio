export class Rutina {
  constructor(
    public idRutina: string,
    public nombre: string,
    public descripcion: string,
    public dificultad: 'Principiante' | 'Intermedio' | 'Avanzado',
    public duracionSemanas?: number
  ) {}
}