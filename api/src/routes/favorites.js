// Rutas de favoritos - Todas requieren autenticación
// GET    /api/favorites           -> Lista de mascotas favoritas del usuario
// POST   /api/favorites/:petId    -> Agregar mascota a favoritos
// DELETE /api/favorites/:petId    -> Quitar mascota de favoritos

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/favorites - Listar favoritos del usuario actual
router.get("/", async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { pet: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites.map((f) => f.pet));
  } catch (error) {
    console.error("Error listando favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/favorites/:petId - Marcar mascota como favorita
router.post("/:petId", async (req, res) => {
  try {
    const petId = Number(req.params.petId);
    if (Number.isNaN(petId)) {
      return res.status(400).json({ error: "ID de mascota inválido" });
    }

    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    const favorite = await prisma.favorite.upsert({
      where: { userId_petId: { userId: req.user.id, petId } },
      update: {},
      create: { userId: req.user.id, petId },
    });

    res.status(201).json({ message: "Agregado a favoritos", favorite });
  } catch (error) {
    console.error("Error agregando favorito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/favorites/:petId - Quitar mascota de favoritos
router.delete("/:petId", async (req, res) => {
  try {
    const petId = Number(req.params.petId);
    if (Number.isNaN(petId)) {
      return res.status(400).json({ error: "ID de mascota inválido" });
    }

    await prisma.favorite.deleteMany({
      where: { userId: req.user.id, petId },
    });

    res.json({ message: "Eliminado de favoritos" });
  } catch (error) {
    console.error("Error eliminando favorito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
