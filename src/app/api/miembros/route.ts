/*
 * Endpoint para gestionar la creación de nuevos miembros.
 */
import { NextResponse } from 'next/server';
import { GestorMiembro } from '../../../services/GestorMiembro';

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    // Validación básica de los datos de entrada
    if (!datos.nombreCompleto || !datos.correoElectronico || !datos.contrasena) {
      return NextResponse.json(
        { message: "Datos incompletos. Se requiere nombreCompleto, correoElectronico y contrasena." },
        { status: 400 } // Bad Request
      );
    }

    const gestor = new GestorMiembro();
    const nuevoMiembro = await gestor.registrarNuevoMiembro(datos);

    // No devolvemos la contraseña en la respuesta
    const miembroSinContrasena = { ...nuevoMiembro };
    delete (miembroSinContrasena as any).contrasena;

    return NextResponse.json(
      { message: "Miembro registrado exitosamente.", data: miembroSinContrasena },
      { status: 201 } // Created
    );

  } catch (error: any) {
    // Manejo de errores específicos lanzados por el gestor
    if (error.message.startsWith("UsuarioExistente:")) {
      return NextResponse.json(
        { message: error.message.replace("UsuarioExistente: ", "") },
        { status: 409 } // Conflict
      );
    }

    // Manejo de errores genéricos
    console.error("Error en el endpoint /api/miembros:", error);
    return NextResponse.json(
      { message: "Error interno del servidor.", error: error.message },
      { status: 500 }
    );
  }
}
