import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Inicializamos la app admin para tener permisos de superusuario
admin.initializeApp();

// Esta es la función que tu botón "Crear Cliente" está buscando
export const createClientUser = functions.https.onCall(async (data, context) => {
  const { email, password, displayName } = data;

  try {
    // Creamos el usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    console.log("Usuario creado con UID:", userRecord.uid);

    // Devolvemos el ID del nuevo usuario al frontend
    return { uid: userRecord.uid };

  } catch (error: any) {
    console.error("Error creando usuario:", error);
    // Lanzamos un error que el frontend pueda entender
    throw new functions.https.HttpsError('internal', error.message);
  }
});
