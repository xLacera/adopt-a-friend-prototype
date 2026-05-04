// Rutas de autenticación - Registro e Inicio de Sesión
// Endpoints: POST /api/auth/register, POST /api/auth/login

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Rate limit para login: 5 intentos cada 15 minutos por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos." },
});

// Rate limit para register: 10 cuentas/hora por IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados registros desde esta IP. Intenta en una hora." },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register - Registrar un nuevo usuario
router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validar campos requeridos
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Todos los campos son requeridos (email, password, name)" });
    }

    // Validar formato de email
    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "El email no tiene un formato válido" });
    }

    // Validar fuerza mínima de contraseña
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    // Validar nombre
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "El nombre debe tener al menos 2 caracteres" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Error en la autenticación: credenciales incorrectas" });
    }

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Error en la autenticación: credenciales incorrectas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Autenticación satisfactoria",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/auth/me - Datos del usuario autenticado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error en /me:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
