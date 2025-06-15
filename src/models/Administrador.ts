import { Usuario } from "./Usuario";
import { Reporte, Producto, Proveedor, Sucursal } from "../types/models";

export class Administrador extends Usuario {
  constructor(
    idUsuario: string,
    nombreCompleto: string,
    correoElectronico: string,
    telefono: string,
    fechaNacimiento: Date,
    contrasena: string
  ) {
    super(idUsuario, nombreCompleto, correoElectronico, telefono, fechaNacimiento, contrasena);
  }

  public generarReporteAsistencia(): Reporte { // 
    console.log(`Admin ${this.nombreCompleto} generando reporte de asistencia.`);
    return { idReporte: 'rep-asist-1', tipo: 'Asistencia', fechaGeneracion: new Date(), datos: {} };
  }

  public generarReporteVentas(): Reporte { // 
    console.log(`Admin ${this.nombreCompleto} generando reporte de ventas.`);
    return { idReporte: 'rep-vent-1', tipo: 'Ventas', fechaGeneracion: new Date(), datos: {} };
  }

  public gestionarInventario(producto: Producto, accion: 'agregar' | 'modificar' | 'eliminar'): void { // 
    console.log(`Gestionando inventario para ${producto.nombre} con acción '${accion}'.`);
  }

  public gestionarPersonal(usuario: Usuario, accion: 'alta' | 'baja'): void {
    console.log(`Gestionando personal: Acción de '${accion}' sobre usuario.`);
  }
  
  public gestionarSucursales(sucursal: Sucursal, accion: 'registrar' | 'modificar' | 'eliminar'): void { // 
      console.log(`Gestionando sucursal ${sucursal.nombre} con acción '${accion}'.`);
  }

  public notificarProveedor(proveedor: Proveedor, mensaje: string): void { // 
      console.log(`Enviando notificación al proveedor ${proveedor.nombre}: "${mensaje}".`);
  }
}