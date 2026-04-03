// Servidor principal - Adopt a Friend API
// Framework: Express.js
// Base de datos: PostgreSQL con Prisma ORM

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const petRoutes = require("./routes/pets");

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
      },
      pets: {
        list: "GET /api/pets",
        detail: "GET /api/pets/:id",
        create: "POST /api/pets (requiere auth)",
        update: "PUT /api/pets/:id (requiere auth)",
        delete: "DELETE /api/pets/:id (requiere auth)",
      },
    },
  });
});

// Registrar rutas
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Documentación de la API en http://localhost:${PORT}`);
});
