export class ProgresoFisico {
  constructor(
    public idProgreso: string,
    public miembroId: string,
    public fechaRegistro: Date,
    public peso?: number,
    public medidasCorporales?: object, 
    public porcentajeGrasa?: number,
    public observaciones?: string
  ) {}
}