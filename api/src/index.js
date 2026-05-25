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

// CORS: en producción restringe al origen del frontend; en desarrollo permite cualquiera.
// FRONTEND_URL acepta una lista separada por comas si se necesitan varios orígenes.
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = allowedOrigins.length === 0
  ? {}
  : {
      origin: (origin, callback) => {
        // Permitir peticiones sin origen (curl, healthchecks de Render) y orígenes en la lista.
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`Origen ${origin} no permitido por CORS`));
      },
      credentials: true,
    };

app.use(cors(corsOptions));
app.use(express.json());

// Healthcheck simple — útil para Render
app.get("/health", (req, res) => res.json({ status: "ok" }));

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
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  if (allowedOrigins.length > 0) {
    console.log(`🔐 CORS limitado a: ${allowedOrigins.join(", ")}`);
  } else {
    console.log("🔓 CORS abierto (modo desarrollo)");
  }
});
