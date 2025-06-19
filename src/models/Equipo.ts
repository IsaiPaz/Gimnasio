export class Equipo {
  constructor(
    public idEquipo: string,
    public nombre: string,
    public idSucursal: string,
    public estado: 'Operativo' | 'Dañado' | 'En Mantenimiento' | 'De Baja',
    public marca?: string,
    public idProveedor?: string,
  ) {}
}