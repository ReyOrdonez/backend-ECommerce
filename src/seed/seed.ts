import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin);
}

createAdmin()
  .catch((e) => console.log(e))
  .finally(async () => await prisma.$disconnect()); // Disconnect after operation
