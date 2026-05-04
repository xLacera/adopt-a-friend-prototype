// Script para poblar la base de datos con mascotas de ejemplo
// Ejecutar con: node prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const pets = [
  {
    name: "Max",
    breed: "Beagle",
    age: "3 meses",
    description: "Juguetón y cariñoso, le encanta correr y jugar con pelotas.",
    imageUrl: "/pet-1.jpg",
    temperament: "Juguetón",
    species: "perro",
    city: "Bogotá",
  },
  {
    name: "Luna",
    breed: "Persa",
    age: "2 meses",
    description: "Tranquila y dulce, perfecta para un hogar tranquilo.",
    imageUrl: "/pet-2.jpg",
    temperament: "Tranquila",
    species: "gato",
    city: "Medellín",
  },
  {
    name: "Rocky",
    breed: "Golden Retriever",
    age: "2 años",
    description: "Energético y leal, ideal para familias activas.",
    imageUrl: "/pet-3.jpg",
    temperament: "Energético",
    species: "perro",
    city: "Cali",
  },
  {
    name: "Mimi",
    breed: "Gata Naranja",
    age: "1 año",
    description: "Elegante y amigable, se lleva bien con otros gatos.",
    imageUrl: "/pet-4.jpg",
    temperament: "Amigable",
    species: "gato",
    city: "Barranquilla",
  },
  {
    name: "Toby",
    breed: "Mestizo",
    age: "6 meses",
    description: "Curioso y muy sociable. Le encanta conocer gente nueva.",
    imageUrl: "/pet-1.jpg",
    temperament: "Curioso",
    species: "perro",
    city: "Cartagena",
  },
  {
    name: "Pelusa",
    breed: "Siames",
    age: "3 años",
    description: "Independiente pero cariñosa. Adora las siestas largas en el sofá.",
    imageUrl: "/pet-2.jpg",
    temperament: "Independiente",
    species: "gato",
    city: "Bucaramanga",
  },
  {
    name: "Bruno",
    breed: "Labrador",
    age: "4 años",
    description: "Tranquilo, paciente y excelente con niños. Ideal para familias.",
    imageUrl: "/pet-3.jpg",
    temperament: "Paciente",
    species: "perro",
    city: "Pereira",
  },
  {
    name: "Nina",
    breed: "Mestiza",
    age: "1 año",
    description: "Pequeña y muy juguetona. Necesita un hogar con espacio para correr.",
    imageUrl: "/pet-4.jpg",
    temperament: "Juguetona",
    species: "gato",
    city: "Manizales",
  },
  {
    name: "Coco",
    breed: "Schnauzer",
    age: "5 años",
    description: "Fiel compañero, ideal para personas mayores o que viven solas.",
    imageUrl: "/pet-1.jpg",
    temperament: "Fiel",
    species: "perro",
    city: "Santa Marta",
  },
  {
    name: "Manchas",
    breed: "Mestizo",
    age: "8 meses",
    description: "Cachorro lleno de energía y muy inteligente. Aprende rápido.",
    imageUrl: "/pet-3.jpg",
    temperament: "Inteligente",
    species: "perro",
    city: "Cúcuta",
  },
  {
    name: "Sasha",
    breed: "Maine Coon",
    age: "2 años",
    description: "Gran tamaño, gran corazón. Se lleva bien con perros también.",
    imageUrl: "/pet-2.jpg",
    temperament: "Cariñosa",
    species: "gato",
    city: "Ibagué",
  },
  {
    name: "Simón",
    breed: "Pastor Alemán",
    age: "3 años",
    description: "Protector y leal. Necesita ejercicio diario y dueños responsables.",
    imageUrl: "/pet-1.jpg",
    temperament: "Protector",
    species: "perro",
    city: "Villavicencio",
  },
  {
    name: "Kira",
    breed: "Bóxer",
    age: "1 año",
    description: "Llena de energía y muy expresiva. Adora los abrazos.",
    imageUrl: "/pet-3.jpg",
    temperament: "Expresiva",
    species: "perro",
    city: "Bogotá",
  },
  {
    name: "Michi",
    breed: "Mestiza",
    age: "4 meses",
    description: "Pequeña gatita rescatada de la calle. Busca un hogar tranquilo.",
    imageUrl: "/pet-4.jpg",
    temperament: "Tímida",
    species: "gato",
    city: "Medellín",
  },
  {
    name: "Thor",
    breed: "Husky",
    age: "2 años",
    description: "Aventurero y enérgico. Necesita espacio y mucho ejercicio.",
    imageUrl: "/pet-1.jpg",
    temperament: "Aventurero",
    species: "perro",
    city: "Cali",
  },
  {
    name: "Lola",
    breed: "Poodle",
    age: "5 años",
    description: "Educada, inteligente y muy cariñosa. No suelta pelo.",
    imageUrl: "/pet-3.jpg",
    temperament: "Educada",
    species: "perro",
    city: "Pereira",
  },
];

async function main() {
  // Limpiar pets existentes (y sus relaciones por cascade)
  await prisma.pet.deleteMany({});

  for (const pet of pets) {
    await prisma.pet.create({ data: pet });
  }

  console.log(`✅ Base de datos poblada con ${pets.length} mascotas en ciudades de Colombia`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
