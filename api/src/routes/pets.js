// Rutas CRUD de Mascotas
// Endpoints públicos: GET /api/pets, GET /api/pets/:id
// Endpoints protegidos (requieren JWT): POST, PUT, DELETE /api/pets

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/pets - Listar todas las mascotas disponibles
router.get("/", async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(pets);
  } catch (error) {
    console.error("Error al listar mascotas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/pets/:id - Obtener detalle de una mascota
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await prisma.pet.findUnique({ where: { id: Number(id) } });

    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    res.json(pet);
  } catch (error) {
    console.error("Error al obtener mascota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/pets - Crear una nueva mascota (protegido)
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, breed, age, description, imageUrl, temperament, species, city } = req.body;

    if (!name || !breed || !age || !description || !temperament || !city) {
      return res.status(400).json({
        error: "Campos requeridos: name, breed, age, description, temperament, city",
      });
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        breed,
        age,
        description,
        imageUrl,
        temperament,
        city: city.trim(),
        species: species || "perro",
      },
    });

    res.status(201).json({ message: "Mascota creada exitosamente", pet });
  } catch (error) {
    console.error("Error al crear mascota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/pets/:id - Actualizar una mascota (protegido)
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breed, age, description, imageUrl, temperament, species, city, available } = req.body;

    const existing = await prisma.pet.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    if (city !== undefined && (!city || !city.trim())) {
      return res.status(400).json({ error: "La ciudad no puede estar vacía" });
    }

    const pet = await prisma.pet.update({
      where: { id: Number(id) },
      data: {
        name,
        breed,
        age,
        description,
        imageUrl,
        temperament,
        species,
        city: city ? city.trim() : undefined,
        available,
      },
    });

    res.json({ message: "Mascota actualizada exitosamente", pet });
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/pets/:id - Eliminar una mascota (protegido)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la mascota existe
    const existing = await prisma.pet.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    await prisma.pet.delete({ where: { id: Number(id) } });

    res.json({ message: "Mascota eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
