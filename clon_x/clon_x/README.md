# Clon X

Aplicación React con autenticación Firebase, rutas privadas y feed social en tiempo real.

## Puesta en marcha

1. En Firebase Console, habilita **Authentication → Sign-in method → Email/Password**.
2. Crea una base de datos de **Cloud Firestore** y habilita **Storage** para el proyecto configurado en `src/firebase/config.ts`.
3. Desde esta carpeta, instala dependencias y ejecuta la aplicación:

   ```sh
   npm install
   npm run dev
   ```

4. Despliega las reglas de Firestore y Storage para perfiles, publicaciones, seguimiento e imágenes:

   ```sh
   firebase login
   firebase use --add
   firebase deploy --only firestore:rules,storage
   ```

   Selecciona el mismo proyecto Firebase configurado en la aplicación. Las reglas se definen en `firebase.json`, `firestore.rules` y `storage.rules`.

Sin sesión, las rutas de Inicio, Perfil, Notificaciones, Mensajes y Guardados redirigen al login. Al iniciar sesión, se vuelve a la ruta solicitada.

El feed global se almacena en `posts`; los perfiles y relaciones de seguimiento se guardan en `users` y `follows`. Los contadores del perfil se actualizan en tiempo real a partir de esas relaciones.

En **Perfil** puedes cambiar la foto y la portada. Se aceptan imágenes JPG, PNG, WEBP o GIF de hasta 5 MB.
