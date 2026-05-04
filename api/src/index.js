// Servidor principal - Adopt a Friend API
// Framework: Express.js
// Base de datos: PostgreSQL con Prisma ORM

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const petRoutes = require("./routes/pets");
const favoriteRoutes = require("./routes/favorites");
const adoptionRoutes = require("./routes/adoptions");

if (!process.env.JWT_SECRET) {
  console.error("❌ Falta la variable JWT_SECRET en el archivo .env. Abortando arranque.");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("❌ Falta la variable DATABASE_URL en el archivo .env. Abortando arranque.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear body JSON

// Ruta principal - Información de la API
app.get("/", (req, res) => {
  res.json({
    name: "Adopt a Friend API",
    version: "1.0.0",
    description: "API REST para la plataforma de adopción de mascotas",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (requiere auth)",
      },
      pets: {
        list: "GET /api/pets",
        detail: "GET /api/pets/:id",
        create: "POST /api/pets (admin)",
        update: "PUT /api/pets/:id (admin)",
        delete: "DELETE /api/pets/:id (admin)",
      },
      favorites: {
        list: "GET /api/favorites (auth)",
        add: "POST /api/favorites/:petId (auth)",
        remove: "DELETE /api/favorites/:petId (auth)",
      },
      adoptions: {
        create: "POST /api/adoptions (auth)",
        mine: "GET /api/adoptions/mine (auth)",
        listAll: "GET /api/adoptions (admin)",
        updateStatus: "PATCH /api/adoptions/:id/status (admin)",
      },
    },
  });
});

// Registrar rutas
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/adoptions", adoptionRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Documentación de la API en http://localhost:${PORT}`);
});
