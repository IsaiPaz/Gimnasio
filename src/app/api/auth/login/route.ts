import { NextResponse } from 'next/server';
import { GestorAutenticacion } from '../../../../services/GestorAutenticacion';

export async function POST(request: Request) {
  try {
    const { correoElectronico, contrasena } = await request.json();

    if (!correoElectronico || !contrasena) {
      return NextResponse.json({ message: "Correo electrónico y contraseña son requeridos." }, { status: 400 });
    }

    const gestor = new GestorAutenticacion();
    const usuario = await gestor.iniciarSesion(correoElectronico, contrasena);

    return NextResponse.json(usuario, { status: 200 });

  } catch (error: any) {
    if (error.message.startsWith("Credenciales inválidas")) {
      return NextResponse.json({ message: error.message }, { status: 401 }); // Unauthorized
    }
    
    console.error("Error en el login:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
