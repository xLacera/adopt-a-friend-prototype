// Rutas de solicitudes de adopción
// POST   /api/adoptions              -> Crear solicitud (auth)
// GET    /api/adoptions/mine         -> Mis solicitudes (auth)
// GET    /api/adoptions              -> Todas las solicitudes (admin)
// PATCH  /api/adoptions/:id/status   -> Cambiar estado (admin)

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// POST /api/adoptions - Crear nueva solicitud para una mascota
router.post("/", async (req, res) => {
  try {
    const { petId, message, phone } = req.body;

    if (!petId || !message) {
      return res.status(400).json({ error: "petId y message son requeridos" });
    }
    if (typeof message !== "string" || message.trim().length < 10) {
      return res.status(400).json({ error: "El mensaje debe tener al menos 10 caracteres" });
    }

    const pet = await prisma.pet.findUnique({ where: { id: Number(petId) } });
    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }
    if (!pet.available) {
      return res.status(400).json({ error: "Esta mascota ya no está disponible" });
    }

    const adoption = await prisma.adoption.create({
      data: {
        userId: req.user.id,
        petId: Number(petId),
        message: message.trim(),
        phone: phone ? phone.trim() : null,
      },
      include: { pet: true },
    });

    res.status(201).json({ message: "Solicitud enviada", adoption });
  } catch (error) {
    console.error("Error creando adopción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/adoptions/mine - Solicitudes del usuario logueado
router.get("/mine", async (req, res) => {
  try {
    const adoptions = await prisma.adoption.findMany({
      where: { userId: req.user.id },
      include: { pet: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(adoptions);
  } catch (error) {
    console.error("Error listando adopciones del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/adoptions - Todas las solicitudes (admin)
router.get("/", adminOnly, async (req, res) => {
  try {
    const adoptions = await prisma.adoption.findMany({
      include: {
        pet: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(adoptions);
  } catch (error) {
    console.error("Error listando adopciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PATCH /api/adoptions/:id/status - Cambiar estado (admin)
router.patch("/:id/status", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Estado inválido. Usa: ${validStatuses.join(", ")}` });
    }

    const id = Number(req.params.id);
    const existing = await prisma.adoption.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    const adoption = await prisma.adoption.update({
      where: { id },
      data: { status },
      include: { pet: true, user: { select: { id: true, name: true, email: true } } },
    });

    // Si se aprueba, marcar la mascota como no disponible
    if (status === "APPROVED") {
      await prisma.pet.update({
        where: { id: adoption.petId },
        data: { available: false },
      });
    }

    res.json({ message: "Estado actualizado", adoption });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
