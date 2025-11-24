import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Inicializa la app de admin solo si no hay apps inicializadas.
// Esto previene errores en ambientes donde la función puede ser reutilizada.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Crea un nuevo usuario en Firebase Authentication y devuelve su UID.
 * Se invoca desde el panel de propietario para registrar nuevos clientes.
 */
export const createClientUser = functions.https.onCall(async (data, context) => {
  // Desestructuramos el objeto 'data' para obtener las variables.
  const { email, password, displayName } = data;

  // Validación de entrada de datos
  if (!email || !password || !displayName) {
    console.error("Faltan datos para crear el usuario. Se requiere email, password y displayName.", data);
    throw new functions.https.HttpsError(
      'invalid-argument',
      'El email, la contraseña y el nombre para mostrar son obligatorios.'
    );
  }

  try {
    // Creamos el usuario en Firebase Authentication usando los datos proporcionados
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    console.log("Usuario creado con éxito. UID:", userRecord.uid);

    // Devolvemos el UID del nuevo usuario al frontend
    return { uid: userRecord.uid };

  } catch (error: any) {
    console.error("Error creando usuario en Firebase Authentication:", error);

    // Mapeo de errores comunes para dar mensajes más claros al frontend
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError('already-exists', 'El correo electrónico ya está en uso por otra cuenta.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new functions.https.HttpsError('invalid-argument', 'El formato del correo electrónico no es válido.');
    }

    // Para cualquier otro error, lanzamos un error genérico
    throw new functions.https.HttpsError('internal', 'Ocurrió un error inesperado al crear el usuario.');
  }
});
