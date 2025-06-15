export interface ProgresoFisico {
  idProgreso: string;
  fecha: Date;
  detalles: string;
}

export interface Pago {
  idPago: string;
  monto: number;
  fecha: Date;
  concepto: string;
}

export interface Factura {
  idFactura: string;
  fecha: Date;
  detalles: string;
  montoTotal: number;
}

export interface Asistencia {
  idAsistencia: string;
  fechaHora: Date;
  tipo: string;
}

export interface Reporte {
  idReporte: string;
  tipo: 'Asistencia' | 'Ventas';
  fechaGeneracion: Date;
  datos: any;
}

export interface Producto {
    idProducto: string;
    nombre: string;
    cantidad: number;
    precio: number;
}

export interface Proveedor {
    idProveedor: string;
    nombre: string;
    contacto: string;
}

export interface Sucursal {
    idSucursal: string;
    nombre: string;
    direccion: string;
}