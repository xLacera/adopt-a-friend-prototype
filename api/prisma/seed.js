// Script para poblar la base de datos con mascotas de ejemplo
// Ejecutar con: node prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Crear mascotas de ejemplo (las mismas del frontend)
  const pets = [
    {
      name: "Max",
      breed: "Beagle",
      age: "3 meses",
      description: "Juguetón y cariñoso, le encanta correr y jugar con pelotas.",
      imageUrl: "/pet-1.jpg",
      temperament: "Juguetón",
      species: "perro",
    },
    {
      name: "Luna",
      breed: "Persa",
      age: "2 meses",
      description: "Tranquila y dulce, perfecta para un hogar tranquilo.",
      imageUrl: "/pet-2.jpg",
      temperament: "Tranquila",
      species: "gato",
    },
    {
      name: "Rocky",
      breed: "Golden Retriever",
      age: "2 años",
      description: "Energético y leal, ideal para familias activas.",
      imageUrl: "/pet-3.jpg",
      temperament: "Energético",
      species: "perro",
    },
    {
      name: "Mimi",
      breed: "Gata Naranja",
      age: "1 año",
      description: "Elegante y amigable, se lleva bien con otros gatos.",
      imageUrl: "/pet-4.jpg",
      temperament: "Amigable",
      species: "gato",
    },
  ];

  for (const pet of pets) {
    await prisma.pet.create({ data: pet });
  }

  console.log("✅ Base de datos poblada con 4 mascotas de ejemplo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
