import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      // Add any additional fields your User model might have
      // For example: email: 'admin@example.com', name: 'Admin User'
      uniqueId: "admin1",
    },
  });

  console.log("Created admin user:", admin);

  // Generate queries from 01-1940 to 12-2024
  const startDate = new Date("1940-01-01");
  const endDate = new Date("2024-12-31");

  for (
    let date = startDate;
    date <= endDate;
    date.setMonth(date.getMonth() + 1)
  ) {
    const query = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

    await prisma.weatherQueries.create({
      data: {
        query,
        users: {
          connect: { id: admin.id },
        },
      },
    });

    console.log(`Created query: ${query}`);
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
