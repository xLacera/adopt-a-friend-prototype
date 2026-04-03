# Adopt a Friend API (Backend)

API RESTful desarrollada en Node.js con Express, utilizando PostgreSQL como base de datos y Prisma ORM. Este proyecto sirve como backend para la plataforma de adopción de mascotas "Adopt a Friend".

## 📋 Requisitos Previos

Para ejecutar este proyecto, el evaluador/instructor necesitará tener instalado:
- **Node.js** (v18 o superior recomendado)
- **PostgreSQL** (Sirviendo en el puerto 5432)

## 🚀 Instrucciones de Ejecución

Siga estos pasos exactos para levantar el servidor y la base de datos localmente:

1. **Instalar dependencias:**
   Abra una terminal en la raíz de este proyecto y ejecute:
   ```bash
   npm install
   ```

2. **Configurar la Base de Datos:**
   Asegúrese de que el servicio de PostgreSQL esté corriendo. Luego, cree una base de datos local llamada `adopt_a_friend`.
   
   El archivo `.env` ya viene preconfigurado con las variables de entorno principales. Si su configuración local de PostgreSQL requiere contraseña, ajuste la variable `DATABASE_URL` en el archivo `.env`.
   ```env
   # Estructura de conexión: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/adopt_a_friend"
   ```

3. **Ejecutar migraciones (Prisma):**
   Para crear las tablas (`User` y `Pet`) en su base de datos, ejecute el siguiente comando (usando Prisma v5.22, ya configurado en el proyecto):
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Poblar datos iniciales (Data Seeding):**
   Para probar la galería sin tener que crear mascotas manualmente, ejecute el script de sembrado para insertar 4 mascotas de prueba:
   ```bash
   node prisma/seed.js
   ```

5. **Iniciar el Servidor:**
   Finalmente, levante el servidor de Express.
   ```bash
   npm start
   ```

El backend quedará escuchando en `http://localhost:3001`. Puede ver una respuesta básica visitando esa raíz en su navegador.

## 🔑 Funcionalidades y Endpoints

El proyecto implementa un flujo completo de autenticación JWT y un CRUD protegido:

### Autenticación
- `POST /api/auth/register`: Requiere `email`, `password`, y `name`. Registra al usuario y devuelve un token JWT.
- `POST /api/auth/login`: Requiere `email` y `password`. Si es exitoso, devuelve un token JWT.

### Mascotas
- `GET /api/pets`: Ruta **PÚBLICA**. Devuelve todas las mascotas disponibles en formato JSON.
- `GET /api/pets/:id`: Ruta **PÚBLICA**. Devuelve el detalle de una mascota específica.
- `POST /api/pets`: Ruta **PROTEGIDA** (Requiere Header `Authorization: Bearer <TOKEN>`). Crea una nueva mascota.
- `PUT /api/pets/:id`: Ruta **PROTEGIDA**. Actualiza datos de una mascota.
- `DELETE /api/pets/:id`: Ruta **PROTEGIDA**. Elimina una mascota.

## 🛠️ Tecnologías Utilizadas

- **Framework:** Express.js 5.2.1
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma v5.22.0
- **Seguridad:** bcryptjs (hash de contraseñas), jsonwebtoken (JWT tokens para estado de sesión), cors (conexiones de origen cruzado).
