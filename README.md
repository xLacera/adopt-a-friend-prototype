# Adopt a Friend 🐾

Plataforma de adopción de mascotas. Cada mascota merece un hogar lleno de amor.

## Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Express.js (Node Backend)
- Prisma (Base de Datos)

## Instalación y Uso

Dado que el proyecto ahora incluye el código del Backend (API) y Frontend (React), debes abrir **dos terminales separadas** al mismo tiempo para que la plataforma funcione de forma local.

### 1. Iniciar la Base de Datos y la API (Terminal 1)
Debes primero inicializar la API. Asegúrate de tener el archivo `.env` configurado dentro de la carpeta `api`.
```bash
cd api
npm install
npm run dev
```
La API quedará escuchando en `http://localhost:3001`

### 2. Iniciar el Frontend React (Terminal 2)
Una vez que el backend esté arriba, abre otra terminal en la ruta principal del proyecto e inicia la parte visual:
```bash
npm install
npm run dev
```
La web quedará escuchando usualmente en `http://localhost:8080` (revisa tu consola si cambia de puerto). Abre ese enlace en tu navegador.

## Equipo

- Camilo Gaitán
- Ana Cristina Vásquez
- Alexandra Giraldo
- Elías Lacera

© 2025 Adopt a Friend
