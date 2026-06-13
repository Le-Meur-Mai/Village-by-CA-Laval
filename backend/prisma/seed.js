import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Initialisation de la base...");

  // -----------------------------
  // 1. ADMIN
  // -----------------------------
  const adminEmail = process.env.ADMIN_EMAIL;
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    admin = await prisma.user.create({
      data: {
        isAdmin: true,
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
      },
    });

    console.log(`Admin créé : ${adminEmail}`);
  } else {
    console.log("Admin déjà existant");
  }

  // -----------------------------
  // 2. TYPES
  // -----------------------------
  const typesData = [
    { name: "Technologie", color: "#3498db" },
    { name: "Environnement", color: "#2ecc71" },
    { name: "Agriculture", color: "#d1f438" },
  ];

  await prisma.type.createMany({
    data: typesData,
    skipDuplicates: true,
  });

  console.log("Types créés");

  const allTypes = await prisma.type.findMany();

  // -----------------------------
  // 3. PICTURES (fictives)
  // -----------------------------
  const logoPic = await prisma.picture.upsert({
    where: { publicId: process.env.DEFAULT_LOGO_PUBLIC_ID },
    update: { secureUrl: process.env.DEFAULT_LOGO_URL },
    create: {
      secureUrl: process.env.DEFAULT_LOGO_URL,
      publicId: process.env.DEFAULT_LOGO_PUBLIC_ID,
    },
  });

  const descPic = await prisma.picture.upsert({
    where: { publicId: process.env.DEFAULT_DESCRIPTION_PICTURE_PUBLIC_ID },
    update: { secureUrl: process.env.DEFAULT_DESCRIPTION_PICTURE_URL },
    create: {
      secureUrl: process.env.DEFAULT_DESCRIPTION_PICTURE_URL,
      publicId: process.env.DEFAULT_DESCRIPTION_PICTURE_PUBLIC_ID,
    },
  });

  // Update si existe, sinon créé
  await prisma.config.upsert({
    where: { id: 1 },
    update: {
      defaultLogoId: logoPic.id,
      defaultDescriptionPictureId: descPic.id,
    },
    create: {
      id: 1,
      defaultLogoId: logoPic.id,
      defaultDescriptionPictureId: descPic.id,
    },
  });


  console.log("Pictures créées");

  // -----------------------------
  // 4. STARTUP
  // -----------------------------
  await prisma.startUp.upsert({
    where: { name: "NovaTech" },
    update: {},
    create: {
      name: "NovaTech",
      description: "Une startup innovante dans la tech.",
      isAlumni: true,
      website: "https://fr.wikipedia.org/wiki/Technologie",
      userId: admin.id,
      descriptionPictureId: descPic.id,
      logoId: logoPic.id,
      types: {
        connect: allTypes.slice(0, 2).map((t) => ({ id: t.id })),
      },
    },
  });

  console.log("Startup ok");

  // -----------------------------
  // 5. QUOTE
  // -----------------------------
  await prisma.quote.upsert({
    where: { description: "Une citation inspirante." },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      description: "Une citation inspirante.",
      userId: admin.id,
    },
  });

  console.log("Quote OK");

  // -----------------------------
  // 7. PARTNER
  // -----------------------------
  await prisma.partner.upsert({
    where: { name: "TechCorp" },
    update: {},
    create: {
      name: "TechCorp",
      description: "Partenaire officiel",
      website: "https://fr.wikipedia.org/wiki/Technologie",
      financialAid: 5000,
      logoId: logoPic.id,
    },
  });

  console.log("Partner OK");

  // -----------------------------
  // 8. POST
  // -----------------------------
  await prisma.post.upsert({
    where: { title: "Bienvenue sur notre plateforme" },
    update: {},
    create: {
      title: "Bienvenue sur notre plateforme",
      description: "Voici notre premier post.",
    },
  });

  console.log("Post OK");

  // -----------------------------
  // 9. EVENT
  // -----------------------------

  /* On supprime cet évènement en particulier pour supprimer les doublons,
  car c'est l'event de test */
  await prisma.event.deleteMany({
  where: { title: "Conférence annuelle" }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0); // date du jour sans heure

  await prisma.event.create({
    data: {
      title: "Conférence annuelle",
      description: "Un grand événement pour tous.",
      color: "#e74c3c",
      date: today,
    }
  });

  console.log("Event OK");

  console.log("Seed terminé !");
}

try {
  await main();
} catch (error) {
  console.error("Erreur:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
