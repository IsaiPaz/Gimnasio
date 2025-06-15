
import { NextResponse } from 'next/server';
// Se importa el GestorProgresoFisico del archivo anterior
import { GestorProgresoFisico } from '../../../../../services/GestorProgresoFisico';

export async function POST(
    request: Request,
    { params }: { params: { miembroId: string } }
) {
  // Se lee el `miembroId` de los parámetros de la URL al inicio.
  const { miembroId } = params;

  try {
    const datosFormulario = await request.json();
    
    const datosProgreso = {
        ...datosFormulario,
        miembroId: miembroId // Se usa el ID de la URL que ya leímos.
    };
    
    const gestor = new GestorProgresoFisico();
    const nuevoProgreso = await gestor.registrarProgreso(datosProgreso);
    
    return NextResponse.json(
        { message: "Progreso registrado exitosamente.", data: nuevoProgreso },
        { status: 201 }
    );

  } catch (error: any) {
    // Con la nueva lógica, este error será más descriptivo.
    if (error.message.startsWith("Acceso Denegado:")) {
        return NextResponse.json({ message: error.message }, { status: 403 });
    }
      
    console.error("Error en el endpoint de progreso:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}

// La función GET no necesita cambios.
export async function GET(
    request: Request,
    { params }: { params: { miembroId: string } }
) {
    try {
        const gestor = new GestorProgresoFisico();
        const historial = await gestor.obtenerHistorial(params.miembroId);
        return NextResponse.json(historial, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error al obtener el historial de progreso." }, { status: 500 });
    }
}