import { Usuario } from "./Usuario";
import { Asistencia, Factura, Pago, ProgresoFisico } from "../types/models";

export class Miembro extends Usuario {
  private idMembresia: string;
  private fechaInscripcion: Date;
  public estadoMembresia: string;
  public tipoMembresia: string;

  constructor(
    idUsuario: string,
    nombreCompleto: string,
    correoElectronico: string,
    telefono: string,
    fechaNacimiento: Date,
    contrasena: string,
    idMembresia: string,
    tipoMembresia: string
  ) {
    super(idUsuario, nombreCompleto, correoElectronico, telefono, fechaNacimiento, contrasena);
    this.idMembresia = idMembresia;
    this.fechaInscripcion = new Date();
    this.estadoMembresia = "Activa";
    this.tipoMembresia = tipoMembresia;
  }

  public inscribirseActividad(idActividad: string): boolean {
    console.log(`Miembro ${this.nombreCompleto} inscribiéndose a la actividad ${idActividad}.`);
    return true;
  }

  public registrarProgresoFisico(progreso: ProgresoFisico): void {
    console.log(`Registrando progreso físico para ${this.nombreCompleto}.`);
  }

  public verHistorialAsistencia(): Asistencia[] {
    console.log(`Consultando historial de asistencia para ${this.nombreCompleto}.`);
    return [];
  }

  public realizarPago(pago: Pago): Factura {
    console.log(`Miembro ${this.nombreCompleto} realizando pago por ${pago.concepto}.`);
    const factura: Factura = { idFactura: 'fact-1', fecha: new Date(), detalles: pago.concepto, montoTotal: pago.monto };
    return factura;
  }

  public getNombreCompleto(): string {
    return this.nombreCompleto;
  }
}