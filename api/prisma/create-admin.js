// Script para crear un usuario administrador
// Uso: node prisma/create-admin.js <email> <password> <nombre>

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const [, , email, password, name] = process.argv;

  if (!email || !password || !name) {
    console.error("Uso: node prisma/create-admin.js <email> <password> <nombre>");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", password: hashed, name },
    create: { email, password: hashed, name, role: "ADMIN" },
  });

  console.log(`✅ Admin listo: ${user.email} (id ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
