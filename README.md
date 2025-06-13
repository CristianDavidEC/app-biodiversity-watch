# Biodiversity Watch App

Aplicación móvil para el monitoreo y registro de biodiversidad.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Expo
- Cuenta de Supabase
- Dispositivo móvil con Expo Go instalado (Android/iOS)

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/CristianDavidEC/app-biodiversity-watch.git
   cd biodiversity-watch-app
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configuración de variables de entorno**
   - Crear un archivo `.env` en la raíz del proyecto
   - Agregar las siguientes variables:
     ```
     SUPABASE_URL=tu_url_de_supabase
     SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
     ```

## Ejecución del Proyecto

1. **Iniciar el servidor de desarrollo**

   ```bash
   npm start
   # o
   yarn start
   ```

2. **Conectar dispositivo móvil**
   - Instalar la aplicación Expo Go en tu dispositivo móvil
   - Asegurarte de que tu teléfono y computadora estén en la misma red WiFi
   - Escanear el código QR que aparece en la terminal con:
     - Android: Usar la app Expo Go
     - iOS: Usar la cámara del teléfono

## Estructura del Proyecto

```
biodiversity-watch-app/
├── app/                 # Páginas y rutas de la aplicación
├── assets/             # Recursos estáticos (imágenes, fuentes)
├── components/         # Componentes reutilizables
├── constants/          # Constantes y configuraciones
├── hooks/             # Custom hooks
├── lib/               # Utilidades y configuraciones
├── providers/         # Proveedores de contexto
└── scripts/           # Scripts de utilidad
```

## Características Principales

- Registro de avistamientos de especies
- Geolocalización de avistamientos
- Captura de fotos
- Mapa interactivo
- Autenticación de usuarios
- Sincronización con base de datos Supabase

## Comandos Útiles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Inicia la aplicación en Android
- `npm run ios` - Inicia la aplicación en iOS
- `npm run web` - Inicia la aplicación en modo web
- `npm run lint` - Ejecuta el linter
- `npm run reset-project` - Resetea el proyecto a su estado inicial

## Solución de Problemas

1. **Error de conexión**

   - Verificar que el dispositivo y la computadora estén en la misma red
   - Asegurarse de que el firewall no esté bloqueando la conexión
   - Reiniciar el servidor de desarrollo

2. **Errores de dependencias**

   - Eliminar la carpeta `node_modules` y el archivo `package-lock.json`
   - Ejecutar `npm install` nuevamente

3. **Problemas con Expo Go**
   - Actualizar la aplicación Expo Go a la última versión
   - Limpiar el caché de la aplicación

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
