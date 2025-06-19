export class NotificacionMantenimiento {
  constructor(
    public idNotificacion: string,
    public idEquipo: string,
    public idMiembroReporta: string,
    public descripcionFalla: string,
    public fechaReporte: Date,
    public estadoNotificacion: 'Abierta' | 'Enviada a Proveedor' | 'Visita Agendada' | 'Resuelta' | 'Cerrada',
    public idAdminGestiona?: string
  ) {}
}