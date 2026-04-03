# Adopt a Friend 🐾

Plataforma de adopción de mascotas. Cada mascota merece un hogar lleno de amor. Este proyecto es una solución integral (Full-Stack) que incluye tanto la interfaz visual como la base de datos y la API.

## Tecnologías Utilizadas

- **Frontend:** React + TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Backend:** Express.js (Node.js).
- **Base de Datos:** Prisma ORM interactuando con PostgreSQL/SQLite.

---

## 🚀 Guía de Instalación y Uso Local

Dado que el proyecto ahora tiene Backend (API) y Frontend (React) separados pero en la misma carpeta, debes abrir **dos terminales distintas** al mismo tiempo para encender ambos motores.

### Paso 1: Configurar e iniciar el Backend (Base de Datos / API)

1. Abre tu primera terminal y entra a la carpeta del backend:
   ```bash
   cd api
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. **⚠️ ¡Importante! Configura tus Variables de Entorno:**
   Para que el Backend pueda conectarse a tu base de datos, necesitas crear un archivo `.env`.
   - Busca el archivo llamado `.env.example` dentro de la carpeta `api/`.
   - Copia ese archivo y renómbralo a `.env` (solo `.env`).
   - Abre el `.env` y sigue las instrucciones comentadas dentro para poner tus propias credenciales.
4. Enciende el servidor API:
   ```bash
   npm run dev
   ```
   > La API quedará encendida y escuchando en `http://localhost:3001`. ¡No cierres esta terminal!

### Paso 2: Configurar e iniciar el Frontend (React visual)

1. Abre una **segunda terminal**, pero esta vez asegúrate de estar en la raíz principal del proyecto (la carpeta `adopt-a-friend-prototype`, fuera de `api`).
2. Instala las dependencias del frontend:
   ```bash
   npm install
   ```
3. Enciende la página web:
   ```bash
   npm run dev
   ```
   > La web quedará escuchando usualmente en `http://localhost:8080` (o el puerto que te indique la consola). 
4. Abre ese enlace en tu navegador. ¡La web se comunicará solita con la terminal del backend que dejaste abierta en el Paso 1!

---

## Equipo

- Camilo Gaitán
- Ana Cristina Vásquez
- Alexandra Giraldo
- Elías Lacera

© 2025 Adopt a Friend
