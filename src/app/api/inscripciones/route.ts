import { NextResponse } from 'next/server';
import { GestorInscripciones } from '../../../services/GestorInscripciones';

export async function POST(request: Request) {
  try {
    const { miembroId, idsClases } = await request.json();

    if (!miembroId || !Array.isArray(idsClases) || idsClases.length === 0) {
      return NextResponse.json(
        { message: "Datos incompletos. Se requiere miembroId y un arreglo de idsClases." },
        { status: 400 }
      );
    }

    const gestor = new GestorInscripciones();
    const resultado = await gestor.inscribirMiembro(miembroId, idsClases);

    // Si hubo fallos, es mejor usar un estado que indique contenido parcial.
    if (resultado.fallidas.length > 0 && resultado.exitosas.length > 0) {
        return NextResponse.json({
            message: "El proceso finalizó con resultados mixtos.",
            data: resultado
        }, { status: 207 }); // 207 Multi-Status
    }

    if (resultado.fallidas.length > 0) {
         return NextResponse.json({
            message: "No se pudo completar la inscripción.",
            data: resultado
        }, { status: 409 }); // 409 Conflict
    }

    return NextResponse.json(
      { message: "Inscripción exitosa en todas las actividades.", data: resultado },
      { status: 201 } // Created
    );

  } catch (error: any) {
    console.error("Error en el endpoint /api/inscripciones:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}

/**
 * Endpoint para obtener todas las clases disponibles.
 */
import { RepositorioClase } from '../../../repositories/RepositorioClase';

export async function GET() {
    try {
        const repo = new RepositorioClase();
        const clases = await repo.obtenerTodas();
        return NextResponse.json(clases, { status: 200 });
    } catch (error) {
        console.error("Error al obtener clases:", error);
        return NextResponse.json({ message: "Error interno al obtener clases." }, { status: 500 });
    }
}
